import rp from 'request-promise';

const API_BASE = `https://api.hipchat.com/v2`;

class HipchatAPI {
    getURI(relPath = '') {
        return `${API_BASE}${relPath}`;
    }

    request(method, token, opts) {
        return rp({
            ...opts,
            method: method.toUpperCase(),
            json: true,
            auth: { bearer: token }
        });
    }

    sendRoomNotification(roomID, token, data) {
        return this.request('post', token, {
            uri: this.getURI(`/room/${roomID}/notification`),
            body: data
        });
    }

    getRoom(roomID, token) {
        return this.request('get', token, {
            uri: this.getURI(`/room/${roomID}`)
        });
    }

}

export default () => new HipchatAPI();
