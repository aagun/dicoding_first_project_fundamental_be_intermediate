/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint(
    "songs",
    "fk_notes.id_album_albums.id",
    "FOREIGN KEY(id_album) REFERENCES albums(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("songs", "fk_notes.id_album_albums.id");
};
  