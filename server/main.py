from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2

app = FastAPI()

DB_DETAILS = {
    "host": "localhost",
    "database": "createDB",
    "user": "postgres",
    "password": "2113"
}

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

@app.post("/crime_data")
async def insert_crime_data(data: CrimeDataIn):
    try:
        conn = psycopg2.connect(**DB_DETAILS)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO crime_data (date_rptd, date_occ, crm_desc, location, weapon_desc, lat, lon, investigator_id, case_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (data.date_rptd, data.date_occ, data.crm_desc, data.location, data.weapon_desc, data.lat, data.lon, data.investigator_id, data.case_id))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

    return {"message": "Data inserted successfully"}

@app.put("/crime_data/{case_id}")
async def update_crime_data(case_id: int, update_info: CrimeUpdate):
    try:
        conn = psycopg2.connect(**DB_DETAILS)
        cur = conn.cursor()

        update_query = "UPDATE crime_data SET "
        update_fields = []

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

        update_query += ", ".join(update_fields)
        update_query += f" WHERE case_id = {case_id}"

        cur.execute(update_query)
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

    return {"message": "Data updated successfully"}

@app.delete("/crime_data/{case_id}")
async def delete_crime_data(case_id: int):
    try:
        conn = psycopg2.connect(**DB_DETAILS)
        cur = conn.cursor()
        cur.execute("DELETE FROM crime_data WHERE case_id = %s;", (case_id,))
        conn.commit()
        conn.close()
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

    return {"message": "Data deleted successfully"}

@app.get("/crime_data")
async def read_crime_data():
    try:
        conn = psycopg2.connect(**DB_DETAILS)
        cur = conn.cursor()
        cur.execute("SELECT * FROM crime_data;")
        rows = cur.fetchall()
        conn.close()
        
        return [{
            "date_rptd": row[0],
            "date_occ": row[1],
            "crm_desc": row[2],
            "location": row[3],
            "weapon_desc": row[4],
            "lat": row[5],
            "lon": row[6],
            "investigator_id": row[7],
            "case_id": row[8]
        } for row in rows]
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")

@app.get("/crime_data/{case_id}")
async def read_single_crime_data(case_id: int):
    try:
        conn = psycopg2.connect(**DB_DETAILS)
        cur = conn.cursor()
        cur.execute("SELECT * FROM crime_data WHERE case_id = %s;", (case_id,))
        row = cur.fetchone()
        conn.close()
        
        if row is None:
            raise HTTPException(status_code=404, detail="Data not found")

        return {
            "date_rptd": row[0],
            "date_occ": row[1],
            "crm_desc": row[2],
            "location": row[3],
            "weapon_desc": row[4],
            "lat": row[5],
            "lon": row[6],
            "investigator_id": row[7],
            "case_id": row[8]
        }
    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {e}")
