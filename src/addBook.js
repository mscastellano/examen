const { v4 } = require("uuid");
const AWS = require("aws-sdk");

exports.addBook = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  try {
    const { title, author, publishedYear, genre } = JSON.parse(event.body);

    // Validación de entrada
    if (!title || !author || !publishedYear || !genre) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Todos los campos son obligatorios." }),
      };
    }

    const createdAt = new Date();
    const BookID = v4();  

    const newBook = {
      BookID,             
      Title: title,
      Author: author,
      PublishedYear: publishedYear,
      Genre: genre,
      CreatedAt: createdAt.toISOString(), 
    };

    await dynamodb.put({
      TableName: "BooksNew",  
      Item: newBook,
    }).promise();

    return {
      statusCode: 201, // Cambiar a 201 para indicar creación exitosa
      body: JSON.stringify(newBook),
    };

  } catch (error) {
    console.error("Error al añadir el libro:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor." }),
    };
  }
};