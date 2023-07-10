const SongViewObject = ({ id, title, year, performer, genre, duration }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
});

const SongsViewObject = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = {
  SongViewObject,
  SongsViewObject,
};
