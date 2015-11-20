import rp from 'request-promise';

const API_BASE = `https://api.github.com/gists`;

class GistAPI {
    getURI(relPath = '') {
        return `${API_BASE}${relPath}`;
    }

    request(method, opts) {
        return rp({
            ...opts,
            method: method.toUpperCase(),
            json: true,
            headers: {
                'User-Agent': 'HipChat-Snippets-Addon'
            }
        });
    }

    get(id) {
        return this.request('get', { uri: this.getURI(`/${id}`) });
    }

    createAnon({descrip = 'HipChat', isPublic = false, ext = 'js', code}) {
        return this.request('post', {
            uri: this.getURI(),
            body: {
                description: descrip,
                public: isPublic,
                files: {
                    [`hipchat.${ext}`]: { content: code }
                }
            }
        });
    }


}

export default () => new GistAPI();
