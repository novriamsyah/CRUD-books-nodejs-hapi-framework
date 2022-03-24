/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable function-paren-newline */
/* eslint-disable consistent-return */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
/* eslint-disable padded-blocks */

const { nanoid } = require('nanoid'); //unik ID package
const books = require('./books'); //import book

// menyimpan buku
const addBookHandler = (request, h) => {

    const { 
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading } = request.payload; //tampung request
    
    //cek request
    if (!name || name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook); //push obj ke books

    const cekBuku = books.filter((itemBook) => itemBook.id === id).length > 0;
    if (cekBuku) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    } 

        const response = h.response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;

};

// melihat semua buku
const getAllBookHandler = (request, h) => {

    const { name, reading, finished } = request.query; //request query tambahan tugas

    if (name !== undefined) {
        //paksa req nama menjadi lower case
        const book = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase())); 

        const response = h.response({
            status: 'success',
            data: {
                books: book.map((item) => ({
                    id: item.id,
                    name: item.name,
                    publisher: item.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (reading !== undefined) {
        const book = books.filter((item) => Number(item.reading) === Number(reading));

        const response = h.response({
            status: 'success',
            data: {
              books: book.map((item) => ({
                id: item.id,
                name: item.name,
                publisher: item.publisher,
              })),
            },
        });
      
        response.code(200);
        return response;
    }

    if (finished !== undefined) {
        const book = books.filter((item) => Number(item.finished) === Number(finished));
    
        const response = h.response({
          status: 'success',
          data: {
            books: book.map((item) => ({
              id: item.id,
              name: item.name,
              publisher: item.publisher,
            })),
          },
        });
    
        response.code(200);
        return response;
    }

        const response = h.response({
            status: 'success',
            data: {
            books: books.map((item) => ({
                id: item.id,
                name: item.name,
                publisher: item.publisher,
            })),
            },
        });
        
        response.code(200);
        return response;
};

// melihat detail Buku berdasar ID
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params; //ambil id request

    const book = books.filter((x) => x.id === bookId)[0];
    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        },
        );
        response.code(200);
        return response;
    }

        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
        
};

// Mengubah Buku Berdasar ID
const editBookByIdHandler = (request, h) => {

    const { bookId } = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
      } = request.payload;

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    if (name === undefined) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
    
        response.code(400);
        return response;
    }
    
      if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
    
        response.code(400);
        return response;
    }

    const index = books.findIndex((item) => item.id === bookId);

    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
      
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
};

// Menghapus Buku berdasar ID
const deleteBookByIdHandler = (request, h) => {

    const { bookId } = request.params;

    const index = books.findIndex((item) => item.id === bookId);

    if (index !== -1) {
        books.splice(index, 1); //hapus berdasarkan requset id 
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
        });

        response.code(200);
        return response;
    }

        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        });
        response.code(404);
        return response;

};

module.exports = { 
addBookHandler,
getAllBookHandler,
getBookByIdHandler,
editBookByIdHandler,
deleteBookByIdHandler }; //ekspor const