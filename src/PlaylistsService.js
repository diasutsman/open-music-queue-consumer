const {Pool} = require('pg');

/**
 * PlaylistsService class
 */
class PlaylistsService {
  /**
   * PlaylistsService constructor
   */
  constructor() {
    this._pool = new Pool();
  }

  /**
   * Get all playlists songs by id
   * @param {String} id
   * @return {Promise<any>}
   */
  async getPlaylistSongsById(id) {
    const query = {
      text: `SELECT playlists.id, playlists.name FROM playlists
                WHERE playlists.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    const [playlist] = result.rows;

    playlist.songs = (await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
            LEFT JOIN playlists_songs ON playlists_songs.song_id = songs.id
            WHERE playlists_songs.playlist_id = $1
            GROUP BY songs.id`,
      values: [id],
    })).rows;

    return {playlist};
  }
}

module.exports = PlaylistsService;
