
// WEEK ONE ASSIGNMENT (MONGODB)
// Switch to the appropriate database
use plp_bookstore;

// 1. BASIC QUERIES

// a) Find all books in a specific genre
db.books.find({ genre: "Fiction" });


// b) Find books published after a certain year
db.books.find({ published_year: { $gt: 1813 } });


// c) Find books by a specific author (case-insensitive)
db.books.find({ author: { $regex: /George Orwell/i } });


// d) Update the price of a specific book
db.books.updateOne(
  { title: "Animal Farm" },
  { $set: { price: 12.57 } }
);

// e) Delete a book by its title
db.books.deleteOne({ title: "Wuthering Heights" });


// 2.  Advanced Queries

// a) Find books that are both in stock and published after 2010
db.books.find({
  inStock: true,
  published_year: { $gt: 2010 }
});

// b) Use projection to return only title, author, and price
db.books.find(
  { inStock: true },
  {
    title: 1,
    author: 1,
    price: 1,
    _id: 0
  }
);

// c) Sort books by price ascending
db.books.find().sort({ price: 1 });

// d) Sort books by price descending
db.books.find().sort({ price: -1 });

// e) Pagination — Page 1 (First 5 books)
db.books.find().skip(0).limit(5);

// f) Pagination — Page 2 (Next 5 books)
db.books.find().skip(5).limit(5);


// a) Calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
]);

// b) Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1
  }
]);

// c) Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$year", 10] } }, 10] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);


// 4. INDEXING & PERFORMANCE


// a) Create an index on the title field
db.books.createIndex({ title: 1 });

// b) Create a compound index on author and year
db.books.createIndex({ author: 1, year: 1 });

// c) Use explain() to show query performance before and after index
db.books.find({ title: "1984" }).explain("executionStats");