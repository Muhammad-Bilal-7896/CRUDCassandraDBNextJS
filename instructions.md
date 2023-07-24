## Instructions 

Now its time to create the table for todos using CQL in the CQL console.
First head over to the CQL console and navigate to the keyspace you created in the previous exercise. 

```cql
use live_coding;
```

Now create a table called todos with the following columns:
```cql
id - uuid (primary key)
posted_by - text
title - text
description - text
date - text
completed - boolean
```

The primary key should be the id column.

The command to create the table "todos" is:
```cql
CREATE TABLE todos (
    posted_by TEXT,
    date TEXT,
    title TEXT,
    description TEXT,
    completed boolean,
    id UUID,
    PRIMARY KEY ((posted_by),date , id)
) WITH CLUSTERING ORDER BY (date ASC, id ASC);
```
So now we have a table called todos with the columns id, title, description, date and completed.
WITH CLUSTERING ORDER BY (id ASC) is used to sort the data in ascending order by id.

Now that we have created the table, you can insert some data into it.

Please enter the following command to insert data into the table "todos" is:
```cql
INSERT INTO todos (posted_by, date, title, description, completed,id)
VALUES ('Muhammad-Bilal', '2020-10-10', 'Learn Cassandra', 'Learn Cassandra in todays tutorial', false, uuid());
INSERT INTO todos (posted_by, date, title, description, completed,id)
VALUES ('Muhammad Bilal', '2023-12-02', 'Learn NEXT JS', 'Learn NEXTJS in todays tutorial', false, uuid());
```

View the data in the table using the following command:
```cql
SELECT * FROM todos;
```

Delte or Drop table
```cql
DROP TABLE live_coding.todos;
```