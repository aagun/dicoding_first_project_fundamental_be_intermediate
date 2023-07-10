/* eslint-disable camelcase */

exports.shorthands = undefined;

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

  pgm.createTable("songs", {
    id: {
      type: "varchar(32)",
      notNull: true,
      primaryKey: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    year: {
      type: "smallint",
      notNull: true,
    },
    performer: {
      type: "varchar(255)",
      notNull: true,
    },
    genre: {
      type: "varchar(50)",
      notNull: true,
    },
    duration: {
      type: "smallint",
      notNull: false,
    },
    id_album: {
      type: "varchar(32)",
      notNull: false,
      references: '"albums"',
      referencesConstraintName: "songs_albums_fkey",
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

exports.down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};
