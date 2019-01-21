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
var index_1 = require("../filter/index");
var ng_api_1 = require("@open-age/ng-api");
var PagerBaseComponent = /** @class */ (function () {
    function PagerBaseComponent(options) {
        this.options = options;
        this.errors = [];
        this.isProcessing = false;
        this.isGettingStats = false;
        this.currentPageNo = 1;
        this.totalPages = 0;
        this.items = [];
        if (!options.pageOptions) {
            options.pageOptions = new ng_api_1.PageOptions();
        }
        this.filters = new index_1.Filters({
            associatedList: this,
            filters: options.filters,
            location: options.location
        });
    }
    PagerBaseComponent.prototype.convertToPageOption = function (pageNo) {
        var options = new ng_api_1.PageOptions();
        options.offset = (pageNo - 1) * this.options.pageOptions.limit;
        options.limit = this.options.pageOptions.limit;
        return options;
    };
    PagerBaseComponent.prototype.fetch = function (options) {
        var _this = this;
        this.isProcessing = true;
        if (!options) {
            options = new ng_api_1.PageOptions();
            if (!this.options.pageOptions.noPaging) {
                options.offset = (this.currentPageNo - 1) * this.options.pageOptions.limit;
                options.limit = this.options.pageOptions.limit;
            }
        }
        this.filters.getQuery();
        return this.options.api.search(this.filters.getQuery(), options).map(function (page) {
            _this.isProcessing = false;
            var items = [];
            page.stats = page.stats || {};
            _(page.items).each(function (item) {
                items.push(item);
            });
            _this.items = items;
            _this.total = page.total || page.stats.total || _this.items.length;
            _this.currentPageNo = page.pageNo;
            _this.totalPages = Math.ceil(_this.total / _this.options.pageOptions.limit);
        }).finally(function () { _this.isProcessing = false; });
    };
    PagerBaseComponent.prototype.add = function (param) {
        this.items.push(param);
        return this;
    };
    ;
    PagerBaseComponent.prototype.remove = function (item) {
        var id = item[this.options.fields.id];
        var found = false;
        if (this.items && this.items.length) {
            var i = this.items.length;
            while (i--) {
                if (this.items[i] && this.items[i][this.options.fields.id] === id) {
                    this.items.splice(i, 1);
                    found = true;
                    break;
                }
            }
        }
        if (found) {
            this.total = this.total - 1;
        }
    };
    PagerBaseComponent.prototype.clear = function () {
        this.total = 0;
        this.items = [];
    };
    ;
    PagerBaseComponent.prototype.pages = function () {
        var maxPages = this.options.maxPagesToShow;
        var index;
        var pageNos = [];
        var firstPage = 1;
        var lastPage = this.totalPages;
        if (this.totalPages > this.options.maxPagesToShow) {
            if (this.currentPageNo < this.options.maxPagesToShow) {
                lastPage = this.options.maxPagesToShow;
            }
            else if (this.currentPageNo > (this.totalPages - this.options.maxPagesToShow)) {
                firstPage = this.totalPages - this.options.maxPagesToShow;
            }
            else {
                firstPage = this.currentPageNo - this.options.maxPagesToShow / 2;
                if (firstPage < 1) {
                    firstPage = 1;
                }
                lastPage = this.currentPageNo + this.options.maxPagesToShow / 2;
                if (lastPage > this.totalPages) {
                    lastPage = this.totalPages;
                }
            }
        }
        if (firstPage !== 1) {
            pageNos.push(-2);
        }
        for (index = firstPage; index <= lastPage; index++) {
            pageNos.push(index);
        }
        if (pageNos.length === 0) {
            pageNos.push(1);
        }
        if (firstPage !== this.totalPages) {
            pageNos.push(-1);
        }
        return pageNos;
    };
    ;
    PagerBaseComponent.prototype.showPage = function (pageNo) {
        if (this.isProcessing) {
            return;
        }
        if (pageNo === -2) {
            pageNo = 1;
            return;
        }
        if (pageNo === -1) {
            pageNo = this.totalPages;
            return;
        }
        return this.fetch(this.convertToPageOption(pageNo));
    };
    PagerBaseComponent.prototype.showPrevious = function () {
        if (this.isProcessing || this.currentPageNo <= 1) {
            return;
        }
        this.showPage(this.currentPageNo - 1);
    };
    ;
    PagerBaseComponent.prototype.showNext = function () {
        if (this.isProcessing || this.totalPages <= this.currentPageNo) {
            return;
        }
        this.showPage(this.currentPageNo + 1);
    };
    ;
    return PagerBaseComponent;
}());
exports.PagerBaseComponent = PagerBaseComponent;
