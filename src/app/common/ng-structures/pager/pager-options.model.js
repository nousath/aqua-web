"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ng_api_1 = require("@open-age/ng-api");
var PagerOptions = /** @class */ (function () {
    function PagerOptions(obj) {
        var _this = this;
        this.maxPagesToShow = 10;
        this.filters = [];
        if (!obj) {
            return;
        }
        if (obj.api) {
            this.api = obj.api;
        }
        if (obj.maxPagesToShow) {
            this.maxPagesToShow = obj.maxPagesToShow;
        }
        if (obj.location) {
            this.location = obj.location;
        }
        if (obj.fields) {
            this.fields = obj.fields;
        }
        if (obj.pageOptions) {
            this.pageOptions = new ng_api_1.PageOptions(obj.pageOptions);
        }
        if (obj.filters) {
            obj.filters.forEach(function (element) {
                _this.filters.push(element);
            });
        }
    }
    return PagerOptions;
}());
exports.PagerOptions = PagerOptions;
