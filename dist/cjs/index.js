"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detail = exports.getId = exports.search = exports.Search = exports.list = exports.latest = exports.getRecent = void 0;
/**
 * @warning
 * @author FrierenDv
 * @version 2.6.8
 * @see @link https://github.com/xct007/nekopoi-scraper
 */
const axios_1 = __importDefault(require("axios"));
const Config_js_1 = require("./Config.js");
/**
 * Get recent hentai
 * @returns {Promise<Object>}
 */
const getRecent = async () => {
    let result = [];
    const data = await axios_1.default
        .get(Config_js_1.URL_RECENT, {
        ...Config_js_1.Config,
    })
        .catch((e) => {
        return e.response;
    });
    if (data.data && data.data.carousel) {
        for (const i of data.data.carousel) {
            delete i["slug"];
            result.push({
                ...i,
            });
        }
    }
    else {
        return {
            status: false,
            message: "failed to fetch data from {URL_RECENT}",
        };
    }
    return result;
};
exports.getRecent = getRecent;
exports.latest = exports.getRecent;
/**
 * Get all list ** by type.
 * @param {String} tipe (optional), eg. "jav" or "hentai", default "hentai".
 * @param {String|Number} page (optional), eg. 2 or idk it can be return error maybe.
 * @returns {Promise<Object>}
 */
const list = async (tipe, page) => {
    let result = [];
    const data = await axios_1.default
        .get((0, Config_js_1.URL_LIST)(tipe ? tipe : "hentai", page ? page : 1), {
        ...Config_js_1.Config,
    })
        .catch((e) => {
        return e.response;
    });
    if (data.data && data.data.result.length) {
        for (const i of data.data.result) {
            result.push({
                ...i,
            });
        }
    }
    else {
        return {
            status: false,
            message: "failed to fetch data from {URL_LIST()}",
        };
    }
    return result;
};
exports.list = list;
/**
 * get hentai by query.
 * @param {String} query
 * @param {Number} limit (optional), for number of output, eg. 10
 * @returns {Promise<Object>}
 */
const Search = async (query, limit) => {
    let result = [];
    const data = await axios_1.default
        .get((0, Config_js_1.URL_SEARCH)(query), {
        ...Config_js_1.Config,
    })
        .catch((e) => {
        return e.response;
    });
    if (data.data && data.data.result.length) {
        let _tmp = [];
        for (const i of data.data.result) {
            _tmp.push({ ...i });
        }
        _tmp = _tmp.filter((val, i) => i < (limit ? Number(limit) : 10));
        result = _tmp;
    }
    else {
        return {
            status: false,
            message: "failed to fetch data from {URL_SEARCH}",
        };
    }
    return result;
};
exports.Search = Search;
exports.search = exports.Search;
/**
 * get hentai detail by id
 * @param {Number} id
 * @returns {Promise<Object>}
 */
const getId = async (id) => {
    let result;
    let data = await axios_1.default
        .get((0, Config_js_1.URL_SERIES)(id), {
        ...Config_js_1.Config,
    })
        .catch((e) => {
        return e.response;
    });
    if (data.data && data.data.episode) {
        const temp = data.data;
        let genre;
        if (temp.info_meta.genre && temp.info_meta.genre.length) {
            let _temp = [];
            for (const i of temp.info_meta.genre) {
                _temp.push(i.name);
            }
            delete temp.info_meta["genre"];
            Object.assign(temp.info_meta, {
                genre: _temp.join(", "),
            });
        }
        result = temp;
    }
    else {
        data = await axios_1.default
            .get((0, Config_js_1.URL_POST)(id), {
            ...Config_js_1.Config,
        })
            .catch((e) => {
            return e.response;
        });
        if (data.data && data.data.stream.length) {
            /** remove some unused <Object> */
            delete data.data["content"];
            delete data.data["slug"];
            delete data.data["note"];
            result = data.data;
        }
        else {
            result = {
                status: false,
                message: "Empty stream result {URL_POST} maybe wrong id or idk",
            };
        }
    }
    return result;
};
exports.getId = getId;
exports.detail = exports.getId;
const nekopoi = {
    search: exports.Search,
    latest: exports.getRecent,
    list: exports.list,
    detail: exports.getId,
    Search: exports.Search,
    getRecent: exports.getRecent,
    getId: exports.getId
};
exports.default = nekopoi;
/** @encode */
//# sourceMappingURL=index.js.map