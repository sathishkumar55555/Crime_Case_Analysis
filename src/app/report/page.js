"use client";
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const fetchTableDescriptions = async () => {
  const res = await fetch('http://localhost:8000/table-descriptions');
  const data = await res.json();
  return data;
};

const ReportPage = () => {
  const [tableDescriptions, setTableDescriptions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchTableDescriptions();
      setTableDescriptions(data);
    };

    getData();
  }, []);

  return (
    <Container>
      <h1 className="p-4 text-2xl text-green-500 text-bold items-center">Database Table Descriptions</h1>
      {tableDescriptions.map(({ table, description, columns }) => (
        <Section key={table}>
          <h2>{table.replace('_', ' ').toUpperCase()}</h2>
          <Description>{description}</Description>
          <Table>
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Data Type</th>
                <th>Primary Key</th>
                <th>Foreign Key</th>
              </tr>
            </thead>
            <tbody>
              {columns.map((column) => (
                <tr key={column.name}>
                  <td>{column.name.replace('_', ' ')}</td>
                  <td>{column.data_type}</td>
                  <td>{column.is_primary ? 'Yes' : 'No'}</td>
                  <td>
                    {column.is_foreign 
                      ? `Yes (References ${column.foreign_table}.${column.foreign_column})`
                      : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
  border-radius: 10px;
  padding: 10px;
  background-color: black;
  border:2px solid green;
`;

const Description = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    border: 1px solid green;
    padding: 8px;
    background-color: black;
    color: white;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    color: black;
  }
`;

export default ReportPage;
