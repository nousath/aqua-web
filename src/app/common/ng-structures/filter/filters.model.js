"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var moment = __importStar(require("moment"));
var http_1 = require("@angular/http");
var filter_model_1 = require("./filter.model");
var Filters = /** @class */ (function () {
    function Filters(options) {
        var _this = this;
        this.options = options;
        this.items = [];
        this.properties = {};
        _.each(options.filters, function (item) {
            var model = new filter_model_1.Filter(item, _this);
            _this.items.push(model);
            _this.properties[model.field] = model;
        });
        this.location = options.location;
    }
    Filters.prototype.apply = function () {
        return this.options.associatedList.fetch();
    };
    Filters.prototype.reset = function () {
        _.each(this.items, function (item) {
            item.reset();
        });
        return this.apply();
    };
    Filters.prototype.get = function (field) {
        return this.properties[field];
    };
    Filters.prototype.set = function (field, value) {
        var item = this.properties[field];
        item.value = value;
        return this.apply();
    };
    Filters.prototype.getQuery = function () {
        var query = {};
        var urlSearchParams = this.location ? (new http_1.URLSearchParams(this.location.path().split('?')[1])) : null;
        var count = 0;
        _.each(this.items, function (item) {
            if (urlSearchParams && !item.skipUrl) {
                var value = _.isDate(item.value) ? moment(item.value).toJSON() : item.value;
                urlSearchParams.set(item.field, item.isEmpty() ? null : value);
            }
            if (item.value && item.value !== '' && item.value !== 0) {
                // params['f[' + count + '][f]'] = item.field;
                // params['f[' + count + '][o]'] = item.operator;
                // params['f[' + count + '][v]'] = item.value;
                query[item.field] = item.value;
                count++;
            }
        });
        if (urlSearchParams) {
            var url = this.location.path().split('?')[0];
            this.location.replaceState(url, urlSearchParams.toString());
        }
        return query;
    };
    return Filters;
}());
exports.Filters = Filters;
