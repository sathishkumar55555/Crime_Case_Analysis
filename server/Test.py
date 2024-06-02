from fastapi import FastAPI, HTTPException
import pandas as pd
import psycopg2
import plotly.express as px
import plotly.io as pio
from fastapi.responses import FileResponse
import folium
from typing import List
import pickle
app = FastAPI()
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You might want to specify specific origins
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS","UPDATE"],  # Include OPTIONS
    allow_headers=["*"],
)


def load_similarity_matrix(file_path):
    with open(file_path, "rb") as f:
        similarity_matrix = pickle.load(f)
    return similarity_matrix

# Example data
new_df = pd.read_pickle('dataframe.pkl') # Your DataFrame containing movie data
similarity = load_similarity_matrix("similarity_matrix.pkl") # Your similarity matrix


# Function to connect to PostgreSQL and retrieve data
def retrieve_data(query):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()
        cur.execute(query)
        data = cur.fetchall()
        conn.close()
        return data
    except psycopg2.Error as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

@app.get("/plot")
def generate_plot():
    # Generate some data
    print("Get Requested")
    x = pd.date_range('2022-01-01', periods=100)
    y = pd.Series(range(100))

    # Create a DataFrame
    df = pd.DataFrame({'Date': x, 'Cases Reported': y})

    # Plot the data
    fig = px.bar(df, x='Date', y='Cases Reported')
    fig.update_layout(
        plot_bgcolor='black',  # Set plot background color to black
        paper_bgcolor='black',  # Set paper background color to black
        font=dict(color='green'),  # Set font color to green
        xaxis=dict(color='green'),  # Set x-axis label color to green
        yaxis=dict(color='green'),  # Set y-axis label color to green
        uniformtext_minsize=8,  # Set minimum text size for uniform text mode
        uniformtext_mode='hide',  # Hide text if it doesn't fit in the bar
        showlegend=False  # Hide legend
    )
    fig.update_traces(marker_color='green')  # Set bar color to green

    # Save the plot as an image
    file_fig = "test.png"
    pio.write_image(fig, file_fig)

    # Return the plot image
    return FileResponse(file_fig)

@app.get("/crime_data")
def get_crime_data(fromDate: str, toDate: str,option:str):
    print("Get Requested")
    try:
        # Convert fromDate and toDate to 'YYYY-MM-DD' format
        from_date_formatted = pd.to_datetime(fromDate).strftime('%Y-%m-%d')
        to_date_formatted = pd.to_datetime(toDate).strftime('%Y-%m-%d')
        
        # Define the SQL query to retrieve the data
        query = f"""
        SELECT
            date_rptd,
            date_occ,
            crm_desc,
            location,
            weapon_desc,
            lat,
            lon,
            investigator_id,
            case_id
        FROM
            crime_data
        WHERE
            date_occ BETWEEN '{from_date_formatted}' AND '{to_date_formatted}'
        LIMIT 200;
        """
        print(fromDate,toDate)
        data = retrieve_data(query)
        print(query)

        # Convert the data to a DataFrame
        columns = ['date_rptd', 'date_occ', 'crm_desc', 'location', 'weapon_desc', 'lat', 'lon', 'investigator_id', 'case_id']
        df = pd.DataFrame(data, columns=columns)

        # Convert date columns to datetime objects with the correct formats
        df['date_rptd'] = pd.to_datetime(df['date_rptd'], errors='coerce')
        df['date_occ'] = pd.to_datetime(df['date_occ'], errors='coerce')

        # Combine the two date columns and drop the original date columns
        df['Date'] = df['date_rptd'].combine_first(df['date_occ'])
        df.drop(['date_rptd', 'date_occ'], axis=1, inplace=True)

        # Filter the DataFrame based on the option
        filtered_df = df[df['crm_desc'].str.contains(option, case=False, na=False)]

        # Group by date and count the reported cases
        g = pd.DataFrame(filtered_df.groupby(filtered_df['Date'].dt.date)['case_id'].count().reset_index())
        g.columns = ['Date', 'Cases Reported']

        # Plot the data
        fig = px.bar(g, x='Date', y='Cases Reported')
        fig.update_layout(
            title=f"Crime Cases Reported from {fromDate} to {toDate} for {option}",
            plot_bgcolor='black',  # Set plot background color to black
            paper_bgcolor='black',  # Set paper background color to black
            font=dict(color='green'),  # Set font color to green
            xaxis=dict(color='green'),  # Set x-axis label color to green
            yaxis=dict(color='green'),  # Set y-axis label color to green
            uniformtext_minsize=8,  # Set minimum text size for uniform text mode
            uniformtext_mode='hide',  # Hide text if it doesn't fit in the bar
            showlegend=False  # Hide legend
        )
        fig.update_traces(marker_color='green')  # Set bar color to green

        # Save the plot as an image
        file_fig = "test.png"
        pio.write_image(fig, file_fig)

        # Return the plot image
        return FileResponse(file_fig)
    except Exception as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

#MAp

@app.get("/crime_map")
def generate_crime_map(fromDate: str, toDate: str, option: str):
    try:
        from_date_formatted = pd.to_datetime(fromDate).strftime('%Y-%m-%d')
        to_date_formatted = pd.to_datetime(toDate).strftime('%Y-%m-%d')
        # Define the SQL query to retrieve the data including the option argument
        query = f"""
        SELECT
            date_rptd,
            date_occ,
            crm_desc,
            location,
            weapon_desc,
            lat,
            lon,
            investigator_id,
            case_id
        FROM
            crime_data
        WHERE
            date_occ BETWEEN '{from_date_formatted}' AND '{to_date_formatted}'
            AND crm_desc ILIKE '%{option}%'
        LIMIT 200;
        """

        # Retrieve data from PostgreSQL table
        data = retrieve_data(query)

        # Convert data to a DataFrame
        columns = ['date_rptd', 'date_occ', 'crm_desc', 'location', 'weapon_desc', 'lat', 'lon', 'investigator_id', 'case_id']
        df = pd.DataFrame(data, columns=columns)

        # Filter out rows with missing latitude and longitude values
        df = df.dropna(subset=['lat', 'lon'])

        # Initialize the map centered at a starting location
        crime_map = folium.Map(location=[df['lat'].mean(), df['lon'].mean()], zoom_start=10)

        # Iterate through each row and add a marker to the map
        for index, row in df.iterrows():
            popup_text = f"Date Occ: {row['date_occ']}, Crime: {row['crm_desc']}"
            marker = folium.Marker(location=[row['lat'], row['lon']], popup=popup_text)
            marker.add_to(crime_map)

        # Save the map as an HTML file
        html_file_path = "crime_map.html"
        crime_map.save(html_file_path)

        # Return the HTML file
        return FileResponse(html_file_path)

    except Exception as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")


@app.get("/recommend")
async def recommend(movie: str):
    try:
        # Find the movie index in the similarity matrix
        movie_index = new_df[new_df['res'].str.contains(movie)].index[0]
        
        # Retrieve distances from the similarity matrix
        distances = similarity[movie_index]
        
        # Sort movies based on distances and get the top 5
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_cases = []
        for i in movies_list:
            case_id = new_df.iloc[i[0]]['Case_id']
            
            # Define SQL query to retrieve case details
            query = f"""
            SELECT t1.date_occ,t1.crm_desc, t3.name, t4.name, t1.location, t1.weapon_desc, t2.name
            FROM crime_data t1
            JOIN witness t2 ON t1.case_id = t2.case_id
            JOIN investigator t3 ON t1.case_id = t3.case_id
            JOIN suspect t4 ON t1.case_id = t4.case_id
            WHERE t1.case_id = '{case_id}';
            """
            # Retrieve case details from PostgreSQL
            case_data = retrieve_data(query)
            
            if case_data:
                # Append case details to the recommended_cases list
                recommended_cases.append({
                    "case_id": str(case_id),
                    "date_occ":str(case_data[0][0]),
                    "crime_description": case_data[0][1],
                    "investigator_name": case_data[0][2],
                    "suspect_name": case_data[0][3],
                    "location": case_data[0][4],
                    "weapon_desc": case_data[0][5],
                    "witness_name": case_data[0][6]
                })
            else:
                return {"error": f"No data found for case_id {case_id}"}

        return {"recommended_cases": recommended_cases}

    except IndexError:
        return {"error": "No movies found for the given query"}
    except Exception as e:
        # Log the error or handle it appropriately
        return {"error": str(e)}

# Define a Pydantic model for input validation
class CrimeDataIn(BaseModel):
    date_rptd: str
    date_occ: str
    crm_desc: str
    location: str
    weapon_desc: str
    lat: float
    lon: float
    investigator_id: int
    case_id: int

# Function to insert data into PostgreSQL
def insert_crime_data(data: CrimeDataIn):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()
        # Insert data into the crime_data table
        cur.execute("""
            INSERT INTO crime_data (date_rptd, date_occ, crm_desc, location, weapon_desc, lat, lon, investigator_id, case_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (data.date_rptd, data.date_occ, data.crm_desc, data.location, data.weapon_desc, data.lat, data.lon, data.investigator_id, data.case_id))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

@app.post("/insert")
def insert_data(data: CrimeDataIn):
    insert_crime_data(data)
    return {"message": "Data inserted successfully"}


def insert_evidence_data(data):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO evidence (evidence_id, date_acquired, case_id, weapon_desc)
            VALUES (%s, %s, %s, %s);
        """, (data.evidence_id, data.date_acquired, data.case_id, data.weapon_desc))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

# Model for evidence data input
class EvidenceIn(BaseModel):
    evidence_id: int
    date_acquired: str
    case_id: int
    weapon_desc: str

# Endpoint to insert evidence data
@app.post("/insert-evidence")
def insert_evidence(data: EvidenceIn):
    insert_evidence_data(data)
    return {"message": "Evidence data inserted successfully"}

class CrimeUpdate(BaseModel):
    date_rptd: str = None
    date_occ: str = None
    crm_desc: str = None
    location: str = None
    weapon_desc: str = None
    lat: float = None
    lon: float = None
    investigator_id: int = None
    case_id: int

def update_data(update_info: CrimeUpdate):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()

        # Generate the SQL update query
        update_query = "UPDATE crime_data SET "
        update_fields = []

        # Add non-null fields to the update query
        if update_info.date_rptd is not None:
            update_fields.append(f"date_rptd = '{update_info.date_rptd}'")
        if update_info.date_occ is not None:
            update_fields.append(f"date_occ = '{update_info.date_occ}'")
        if update_info.crm_desc is not None:
            update_fields.append(f"crm_desc = '{update_info.crm_desc}'")
        if update_info.location is not None:
            update_fields.append(f"location = '{update_info.location}'")
        if update_info.weapon_desc is not None:
            update_fields.append(f"weapon_desc = '{update_info.weapon_desc}'")
        if update_info.lat is not None:
            update_fields.append(f"lat = {update_info.lat}")
        if update_info.lon is not None:
            update_fields.append(f"lon = {update_info.lon}")
        if update_info.investigator_id is not None:
            update_fields.append(f"investigator_id = {update_info.investigator_id}")

        # Construct the SET clause of the query
        update_query += ", ".join(update_fields)

        # Add WHERE clause to specify the row to update
        update_query += f" WHERE case_id = {update_info.case_id}"

        # Execute the update query
        cur.execute(update_query)
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

@app.post("/update")
def update_crime_data(update_info: CrimeUpdate):
    update_data(update_info)
    return {"message": "Data updated successfully"}

# Define the CrimeUpdate model
class CrimeUpdate(BaseModel):
    case_id: int

# Function to delete data based on case_id
def delete_data(case_id: int):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()

        # Generate the SQL delete queries for all tables
        tables = ["crime_data", "evidence", "investigator", "suspect", "witness"]
        for table in tables:
            delete_query = f"DELETE FROM {table} WHERE case_id = {case_id}"
            cur.execute(delete_query)

        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        # Log the error or handle it appropriately
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")


# FastAPI instance


# Delete endpoint
@app.delete("/delete/{case_id}")
def delete_crime_data(case_id: int):
    delete_data(case_id)
    return {"message": "Data deleted successfully"}



class ColumnDetail(BaseModel):
    name: str
    data_type: str
    is_primary: bool
    is_foreign: bool
    foreign_table: str = None
    foreign_column: str = None

class TableDescription(BaseModel):
    table: str
    description: str
    columns: list[ColumnDetail]

def fetch_table_description(table: str):
    columns_query = f"""
        SELECT 
            c.column_name, 
            c.data_type, 
            tc.constraint_type,
            kcu.table_name AS foreign_table,
            kcu.column_name AS foreign_column
        FROM information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu
            ON c.column_name = kcu.column_name AND c.table_name = kcu.table_name
        LEFT JOIN information_schema.table_constraints tc
            ON tc.constraint_name = kcu.constraint_name AND tc.table_name = c.table_name
        WHERE c.table_name = '{table}'
        ORDER BY c.ordinal_position;
    """
    rows = retrieve_data(columns_query)
    columns = []
    for row in rows:
        name, data_type, constraint_type, foreign_table, foreign_column = row
        is_primary = constraint_type == 'PRIMARY KEY'
        is_foreign = constraint_type == 'FOREIGN KEY'
        # Handle case_id as primary key in crime_data and as foreign key in other tables
        if name == 'case_id':
            if table == 'crime_data':
                is_primary = True
            else:
                is_foreign = True
                foreign_table = 'crime_data'
                foreign_column = 'case_id'
        columns.append(ColumnDetail(
            name=name,
            data_type=data_type,
            is_primary=is_primary,
            is_foreign=is_foreign,
            foreign_table=foreign_table or '',
            foreign_column=foreign_column or ''
        ))
    return columns

@app.get("/table-descriptions", response_model=list[TableDescription])
async def get_table_descriptions():
    table_descriptions = [
        {
            "table": "crime_data",
            "description": "This table contains information about reported crimes, including the date reported, date occurred, crime description, location, weapon used, latitude, longitude, investigator ID, and case ID.",
            "columns": fetch_table_description("crime_data")
        },
        {
            "table": "evidence",
            "description": "This table stores details about the evidence acquired for cases, including the date acquired, case ID, and weapon description.",
            "columns": fetch_table_description("evidence")
        },
        {
            "table": "investigator",
            "description": "This table lists the investigators, including their name, date of birth, department, and associated case ID.",
            "columns": fetch_table_description("investigator")
        },
        {
            "table": "suspect",
            "description": "This table contains information about suspects, including their name, date of birth, and associated case ID.",
            "columns": fetch_table_description("suspect")
        },
        {
            "table": "witness",
            "description": "This table records information about witnesses, including their name, date of birth, and associated case ID.",
            "columns": fetch_table_description("witness")
        }
    ]
    return table_descriptions


class CrimeData(BaseModel):
    date_rptd: str
    date_occ: str
    crm_desc: str
    location: str
    weapon_desc: str
    lat: float
    lon: float
    investigator_id: int
    case_id: int

class Evidence(BaseModel):
    evidence_id: int
    date_acquired: str
    case_id: int
    weapon_desc: str

class Investigator(BaseModel):
    investigator_id: int
    name: str
    date_of_birth: str
    department: str
    case_id: int

class Suspect(BaseModel):
    suspect_id: int
    name: str
    dob: str
    case_id: int

class Witness(BaseModel):
    witness_id: int
    name: str
    dob: str
    case_id: int

def insert_data(table, data):
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="createDB",
            user="postgres",
            password="2113"
        )
        cur = conn.cursor()
        columns = ', '.join(data.keys())
        values = ', '.join([f"'{v}'" if isinstance(v, str) else str(v) for v in data.values()])
        cur.execute(f"INSERT INTO {table} ({columns}) VALUES ({values});")
        conn.commit()
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert data into {table}: {str(e)}")

@app.post("/insert")
async def insert_data_into_tables(crime_data: CrimeData, evidence: Evidence, investigator: Investigator, suspect: Suspect, witness: Witness):
    insert_data('crime_data', crime_data.dict())
    insert_data('evidence', evidence.dict())
    insert_data('investigator', investigator.dict())
    insert_data('suspect', suspect.dict())
    insert_data('witness', witness.dict())
    return {"message": "Data inserted successfully into all tables"}


class Evidence(BaseModel):
    evidence_id: int
    date_acquired: str
    case_id: int
    weapon_desc: str
