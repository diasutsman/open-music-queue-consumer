/**
 * Listener class
 */
class Listener {
  /**
   * Listener Constructor
   * @param {PlaylistsService} playlistsService
   * @param {MailSender} mailSender
   */
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  /**
   * Listen to the message
   * @param {String} message
   */
  async listen(message) {
    try {
      const {playlistId, targetEmail} = JSON.parse(message.content.toString());

      const playlist = await this._playlistsService.getPlaylistSongsById(
          playlistId,
      );
      const result = await this._mailSender.sendEmail(
          targetEmail, JSON.stringify(playlist),
      );
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
