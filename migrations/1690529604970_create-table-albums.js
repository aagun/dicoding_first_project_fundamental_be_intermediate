/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "varchar(32)",
      notNull: true,
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    year: {
      type: "smallint",
      notNull: true,
    },
    created_by: {
      type: "varchar(255)",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: false,
    },
    updated_by: {
      type: "varchar(255)",
      notNull: false,
    },
  });
};

exports.down = (pgm) => {};
