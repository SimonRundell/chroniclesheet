import axios from 'axios';
import { config } from '../config';

/**
 * Shared axios instance for all API calls. Uses cookies (PHP session) for
 * auth, so withCredentials is required on every request. baseURL is set by
 * main.jsx's bootstrap() once /.config.json has loaded.
 */
const client = axios.create({
    withCredentials: true,
});

/** Auth endpoints. */
export const authApi = {
    register: (data) => client.post('/auth/register.php', data).then((r) => r.data),
    login: (data) => client.post('/auth/login.php', data).then((r) => r.data),
    logout: () => client.post('/auth/logout.php').then((r) => r.data),
    me: () => client.get('/auth/me.php').then((r) => r.data),
};

/** Character sheet endpoints. */
export const charactersApi = {
    list: () => client.get('/characters/list.php').then((r) => r.data),
    create: (data) => client.post('/characters/create.php', data).then((r) => r.data),
    get: (id) => client.get('/characters/get.php', { params: { id } }).then((r) => r.data),
    update: (id, data) =>
        client.put('/characters/update.php', data, { params: { id } }).then((r) => r.data),
    remove: (id) => client.delete('/characters/delete.php', { params: { id } }).then((r) => r.data),
    uploadAvatar: (id, file) => {
        const form = new FormData();
        form.append('avatar', file);
        return client
            .post('/characters/upload_avatar.php', form, { params: { id } })
            .then((r) => r.data);
    },
    removeAvatar: (id) =>
        client.post('/characters/remove_avatar.php', null, { params: { id } }).then((r) => r.data),
};

/**
 * Builds the URL for a character's uploaded avatar image.
 *
 * @param {string|null|undefined} filename
 * @returns {string|null}
 */
export function avatarUrl(filename) {
    return filename ? `${config.apiBaseUrl}/uploads/avatars/${filename}` : null;
}

/** Campaign endpoints. */
export const campaignsApi = {
    create: (data) => client.post('/campaigns/create.php', data).then((r) => r.data),
    list: () => client.get('/campaigns/list.php').then((r) => r.data),
    join: (data) => client.post('/campaigns/join.php', data).then((r) => r.data),
    leave: (data) => client.post('/campaigns/leave.php', data).then((r) => r.data),
    regenerateCode: (data) => client.post('/campaigns/regenerate_code.php', data).then((r) => r.data),
    liveCharacters: (campaignId) =>
        client
            .get('/campaigns/characters.php', { params: { campaign_id: campaignId } })
            .then((r) => r.data),
};

export default client;
