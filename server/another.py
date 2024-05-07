from fastapi import FastAPI
from typing import List
import pickle
import pandas as pd
import psycopg2

app = FastAPI()

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
    
@app.get("/recommend")
async def recommend(movie: str):
    try:
        movie_index = new_df[new_df['res'].str.contains(movie)].index[0]
        distances = similarity[movie_index]
        movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]

        recommended_movies = []
        for i in movies_list:
            recommended_movies.append({
                "title": new_df.iloc[i[0]]['Case_id'],
                # Add more movie attributes here as needed
            })

        return {"recommended_movies": recommended_movies}

    except Exception as e:
        # Log the error or handle it appropriately
        return {"error": str(e)}



@app.get("/recom")
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
                    "case_id": case_id,
                    "date_occ": case_data[0][0],
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