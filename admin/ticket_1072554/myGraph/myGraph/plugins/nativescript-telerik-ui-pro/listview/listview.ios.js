var viewModule = require("ui/core/view");
var observableArray = require("data/observable-array");
var dependencyObservable = require("ui/core/dependency-observable");
var commonModule = require("./listview-common");
var utilsModule = require("utils/utils");
var proxyModule = require("ui/core/proxy");
var colorModule = require("color");
require("utils/module-merge").merge(commonModule, exports);
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.itemTemplate = "itemTemplate";
    knownTemplates.itemSwipeTemplate = "itemSwipeTemplate";
    knownTemplates.loadOnDemandItemTemplate = "loadOnDemandItemTemplate";
    knownTemplates.headerItemTemplate = "headerItemTemplate";
    knownTemplates.footerItemTemplate = "footerItemTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var ReorderHandle = (function (_super) {
    __extends(ReorderHandle, _super);
    function ReorderHandle() {
        _super.call(this);
    }
    return ReorderHandle;
})(commonModule.ReorderHandle);
exports.ReorderHandle = ReorderHandle;
var ListViewLayoutBase = (function (_super) {
    __extends(ListViewLayoutBase, _super);
    function ListViewLayoutBase() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(ListViewLayoutBase.prototype, "ios", {
        get: function () {
            if (!this._ios) {
                this._ios = this.getNativeLayout();
                this._ios.dynamicItemSize = this.supportsDynamicSize();
            }
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ListViewLayoutBase.prototype.supportsDynamicSize = function () {
        return true;
    };
    ListViewLayoutBase.prototype.init = function (owner) {
        this._owner = owner;
        this.syncOwnerScrollDirection(this.scrollDirection);
    };
    ListViewLayoutBase.prototype.reset = function () {
        this._owner = undefined;
    };
    ListViewLayoutBase.prototype.getNativeLayout = function () {
        return undefined;
    };
    ListViewLayoutBase.prototype.onScrollDirectionChanged = function (data) {
        if (data.newValue) {
            this.ios.scrollDirection = (data.newValue === commonModule.ListViewScrollDirection.Horizontal) ?
                TKListViewScrollDirection.TKListViewScrollDirectionHorizontal :
                TKListViewScrollDirection.TKListViewScrollDirectionVertical;
            this.syncOwnerScrollDirection(data.newValue);
        }
    };
    ListViewLayoutBase.prototype.syncOwnerScrollDirection = function (newScrollDirection) {
        if (this._owner === undefined) {
            return;
        }
        this._owner.ios.scrollDirection = (newScrollDirection === commonModule.ListViewScrollDirection.Horizontal) ?
            TKListViewScrollDirection.TKListViewScrollDirectionHorizontal :
            TKListViewScrollDirection.TKListViewScrollDirectionVertical;
    };
    ListViewLayoutBase.prototype.onItemInsertAnimationChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        this.ios.animationDuration = 0.5;
        switch (commonModule.ListViewItemAnimation[data.newValue]) {
            case commonModule.ListViewItemAnimation.Fade: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationFade;
                break;
            }
            case commonModule.ListViewItemAnimation.Scale: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationScale;
                break;
            }
            case commonModule.ListViewItemAnimation.Slide: {
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationSlide;
                break;
            }
            default:
                this.ios.itemInsertAnimation = TKListViewItemAnimation.TKListViewItemAnimationDefault;
        }
    };
    ListViewLayoutBase.prototype.onItemDeleteAnimationChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        this.ios.animationDuration = 0.5;
        switch (commonModule.ListViewItemAnimation[data.newValue]) {
            case commonModule.ListViewItemAnimation.Fade: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationFade;
                break;
            }
            case commonModule.ListViewItemAnimation.Scale: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationScale;
                break;
            }
            case commonModule.ListViewItemAnimation.Slide: {
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationSlide;
                break;
            }
            default:
                this.ios.itemDeleteAnimation = TKListViewItemAnimation.TKListViewItemAnimationDefault;
        }
    };
    ListViewLayoutBase.prototype.onItemWidthChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.updateItemSize();
        }
    };
    ListViewLayoutBase.prototype.onItemHeightChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.updateItemSize();
        }
    };
    ListViewLayoutBase.prototype.updateItemSize = function () {
        this.ios.itemSize = CGSizeMake(this.itemWidth ? this.itemWidth : this.ios.itemSize.width, this.itemHeight ? this.itemHeight : this.ios.itemSize.height);
    };
    return ListViewLayoutBase;
})(commonModule.ListViewLayoutBase);
exports.ListViewLayoutBase = ListViewLayoutBase;
var ListViewLinearLayout = (function (_super) {
    __extends(ListViewLinearLayout, _super);
    function ListViewLinearLayout() {
        _super.apply(this, arguments);
    }
    ListViewLinearLayout.prototype.getNativeLayout = function () {
        return TKListViewLinearLayout.new();
    };
    return ListViewLinearLayout;
})(ListViewLayoutBase);
exports.ListViewLinearLayout = ListViewLinearLayout;
var ListViewGridLayout = (function (_super) {
    __extends(ListViewGridLayout, _super);
    function ListViewGridLayout() {
        _super.apply(this, arguments);
    }
    ListViewGridLayout.prototype.getNativeLayout = function () {
        return TKListViewGridLayout.new();
    };
    ListViewGridLayout.prototype.supportsDynamicSize = function () {
        return false;
    };
    Object.defineProperty(ListViewGridLayout.prototype, "spanCount", {
        get: function () {
            return this._getValue(ListViewGridLayout.spanCountProperty);
        },
        set: function (value) {
            this._setValue(ListViewGridLayout.spanCountProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewGridLayout.onSpanCountPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onSpanCountChanged(data);
    };
    ListViewGridLayout.prototype.onSpanCountChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.ios.spanCount = data.newValue;
        }
    };
    Object.defineProperty(ListViewGridLayout.prototype, "lineSpacing", {
        get: function () {
            return this._getValue(ListViewGridLayout.spanCountProperty);
        },
        set: function (value) {
            this._setValue(ListViewGridLayout.lineSpacingProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    ListViewGridLayout.onLineSpacingPropertyChanged = function (data) {
        var lvLayout = data.object;
        lvLayout.onLineSpacingChanged(data);
    };
    ListViewGridLayout.prototype.onLineSpacingChanged = function (data) {
        if (!isNaN(+data.newValue)) {
            this.ios.lineSpacing = data.newValue;
        }
    };
    //note: this property should be defined in common module, but inheritence will not be possible then
    ListViewGridLayout.spanCountProperty = new dependencyObservable.Property("spanCount", "ListViewGridLayout", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewGridLayout.onSpanCountPropertyChanged));
    //note: this property should be defined in common module, but inheritence will not be possible then
    ListViewGridLayout.lineSpacingProperty = new dependencyObservable.Property("lineSpacing", "ListViewGridLayout", new proxyModule.PropertyMetadata(undefined, dependencyObservable.PropertyMetadataSettings.AffectsLayout, ListViewGridLayout.onLineSpacingPropertyChanged));
    return ListViewGridLayout;
})(ListViewLayoutBase);
exports.ListViewGridLayout = ListViewGridLayout;
var ListViewStaggeredLayout = (function (_super) {
    __extends(ListViewStaggeredLayout, _super);
    function ListViewStaggeredLayout() {
        _super.apply(this, arguments);
    }
    //    private _localDelegate;
    ListViewStaggeredLayout.prototype.getNativeLayout = function () {
        var layout = TKListViewStaggeredLayout.new();
        return layout;
    };
    ListViewStaggeredLayout.prototype.supportsDynamicSize = function () {
        return true;
    };
    ListViewStaggeredLayout.prototype.updateItemSize = function () {
    };
    return ListViewStaggeredLayout;
})(ListViewGridLayout);
exports.ListViewStaggeredLayout = ListViewStaggeredLayout;
/////////////////////////////////////////////////////////////
// TKListViewDelegateImpl
var TKListViewDelegateImpl = (function (_super) {
    __extends(TKListViewDelegateImpl, _super);
    function TKListViewDelegateImpl() {
        _super.apply(this, arguments);
    }
    TKListViewDelegateImpl.new = function () {
        return _super.new.call(this);
    };
    TKListViewDelegateImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    Object.defineProperty(TKListViewDelegateImpl.prototype, "swipeLimits", {
        get: function () {
            if (!this._swipeLimits) {
                this._swipeLimits = (this._owner.listViewLayout.scrollDirection === "Vertical") ?
                    { left: 60, top: 0, right: 60, bottom: 0, threshold: 30 } :
                    { left: 0, top: 60, right: 0, bottom: 60, threshold: 30 };
            }
            return this._swipeLimits;
        },
        enumerable: true,
        configurable: true
    });
    TKListViewDelegateImpl.prototype.listViewShouldHighlightItemAtIndexPath = function (listView, indexPath) {
        return true;
    };
    TKListViewDelegateImpl.prototype.listViewDidHighlightItemAtIndexPath = function (listView, indexPath) {
    };
    TKListViewDelegateImpl.prototype.listViewDidUnhighlightItemAtIndexPath = function (listView, indexPath) {
    };
    TKListViewDelegateImpl.prototype.listViewShouldSelectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.RadListView.itemSelectingEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewDidSelectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.RadListView.itemSelectedEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidDeselectItemAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.RadListView.itemDeselectingEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        var argsDeselected = { eventName: commonModule.RadListView.itemDeselectedEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(argsDeselected);
    };
    TKListViewDelegateImpl.prototype.listViewWillReorderItemAtIndexPath = function (listView, indexPath) {
        if (!listView || !indexPath) {
            return;
        }
        var args = {
            eventName: commonModule.RadListView.itemReorderStartedEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section,
            data: undefined
        };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidReorderItemFromIndexPathToIndexPath = function (listView, originalIndexPath, targetIndexPath) {
        if (!listView || !originalIndexPath || !targetIndexPath) {
            return;
        }
        this._owner._reorderItemInSource(originalIndexPath.row, targetIndexPath.row);
        var args = {
            eventName: commonModule.RadListView.itemReorderedEvent, object: this._owner, itemIndex: originalIndexPath.row, groupIndex: originalIndexPath.section,
            data: { targetIndex: targetIndexPath.row, targetGroupIndex: targetIndexPath.section }
        };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewShouldSwipeCellAtIndexPath = function (listView, cell, indexPath) {
        var shouldSwipe = true;
        if (this._owner.hasListeners(commonModule.RadListView.itemSwipingEvent)) {
            var args = { eventName: commonModule.RadListView.itemSwipingEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
            this._owner.notify(args);
            shouldSwipe = args.returnValue;
        }
        if (shouldSwipe) {
            var viewAtIndex = this._owner._realizedCells.get(cell.tag).view;
            var startArgs = { eventName: commonModule.RadListView.itemSwipeProgressStartedEvent, object: viewAtIndex.itemSwipeView, itemIndex: indexPath.row, groupIndex: indexPath.section, data: { swipeLimits: this.swipeLimits } };
            this._owner.notify(startArgs);
            var swipeLimits = startArgs.data.swipeLimits;
            if (swipeLimits) {
                this._owner.ios.cellSwipeLimits = UIEdgeInsetsFromString("{" + swipeLimits.top + ", " + swipeLimits.left + ", " + swipeLimits.bottom + ", " + swipeLimits.right + "}");
                this._owner.ios.cellSwipeTreshold = swipeLimits.threshold;
            }
        }
        return shouldSwipe;
    };
    TKListViewDelegateImpl.prototype.listViewDidSwipeCellAtIndexPathWithOffset = function (listView, cell, indexPath, offset) {
        if (!indexPath) {
            return;
        }
        var viewAtIndex = this._owner._realizedCells.get(cell.tag).view;
        var swipeOffset = { x: offset.x, y: offset.y, swipeLimits: this.swipeLimits };
        var args = { eventName: commonModule.RadListView.itemSwipeProgressChangedEvent, object: viewAtIndex.itemSwipeView, itemIndex: indexPath.row, groupIndex: indexPath.section, data: swipeOffset };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidFinishSwipeCellAtIndexPathWithOffset = function (listView, cell, indexPath, offset) {
        if (!indexPath || !this._owner.hasListeners(commonModule.RadListView.itemSwipeProgressEndedEvent)) {
            return;
        }
        var viewAtIndex = this._owner._realizedCells.get(cell.tag).view;
        var swipeOffset = { x: offset.x, y: offset.y, swipeLimits: this.swipeLimits };
        var args = { eventName: commonModule.RadListView.itemSwipeProgressEndedEvent, object: viewAtIndex.itemSwipeView, itemIndex: indexPath.row, groupIndex: indexPath.section, data: swipeOffset };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewDidPullWithOffset = function (listView, offset) {
    };
    TKListViewDelegateImpl.prototype.listViewDidLongPressCellAtIndexPath = function (listView, cell, indexPath) {
        if (!indexPath) {
            return;
        }
        var args = { eventName: commonModule.RadListView.itemHoldEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section };
        this._owner.notify(args);
    };
    TKListViewDelegateImpl.prototype.listViewShouldLoadMoreDataAtIndexPath = function (listView, indexPath) {
        if (!indexPath) {
            return false;
        }
        var args = { eventName: commonModule.RadListView.loadMoreDataRequestedEvent, object: this._owner, itemIndex: indexPath.row, groupIndex: indexPath.section, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.prototype.listViewShouldRefreshOnPull = function (listView) {
        var args = { eventName: commonModule.RadListView.pullToRefreshInitiatedEvent, object: this._owner, returnValue: true };
        this._owner.notify(args);
        return args.returnValue;
    };
    TKListViewDelegateImpl.ObjCProtocols = [TKListViewDelegate];
    return TKListViewDelegateImpl;
})(NSObject);
/////////////////////////////////////////////////////////////
// TKListViewDataSourceImpl
var TKListViewDataSourceImpl = (function (_super) {
    __extends(TKListViewDataSourceImpl, _super);
    function TKListViewDataSourceImpl() {
        _super.apply(this, arguments);
        this.i = 0;
    }
    TKListViewDataSourceImpl.new = function () {
        return _super.new.call(this);
    };
    TKListViewDataSourceImpl.prototype.initWithOwner = function (owner) {
        this._owner = owner;
        return this;
    };
    TKListViewDataSourceImpl.prototype.listViewNumberOfItemsInSection = function (listView, section) {
        return this._owner.items ? this._owner.items.length : 0; //todo: update to support custom DataSource object from owner
    };
    TKListViewDataSourceImpl.prototype.listViewCellForItemAtIndexPath = function (listView, indexPath) {
        this._owner._preparingCell = true;
        var loadOnDemandCell = listView.dequeueLoadOnDemandCellForIndexPath(indexPath);
        if (loadOnDemandCell) {
            loadOnDemandCell.owner = this._owner;
            if (this._owner.loadOnDemandItemTemplate || this._owner.itemViewLoader) {
                this._owner.prepareLoadOnDemandCell(loadOnDemandCell, indexPath);
            }
            return loadOnDemandCell;
        }
        var cell = listView.dequeueReusableCellWithReuseIdentifierForIndexPath("defaultCell", indexPath);
        if (!cell.owner) {
            cell.backgroundView.stroke = null;
            cell.selectedBackgroundView.stroke = null;
            cell.offsetContentViewInMultipleSelection = false;
            cell.owner = this._owner;
        }
        this._owner.prepareCell(cell, indexPath);
        this._owner._preparingCell = false;
        return cell;
    };
    TKListViewDataSourceImpl.prototype.numberOfSectionsInListView = function (listView) {
        //todo: call event handler from public interface
        return 1; //todo: here we should get value from datasource
    };
    TKListViewDataSourceImpl.prototype.listViewViewForSupplementaryElementOfKindAtIndexPath = function (listView, kind, indexPath) {
        var cell;
        if (kind === "header" && (this._owner.headerItemTemplate !== undefined || this._owner.itemViewLoader !== undefined)) {
            cell = listView.dequeueReusableSupplementaryViewOfKindWithReuseIdentifierForIndexPath(kind, NSString.stringWithCString("header"), indexPath);
            this._owner._preparingCell = true;
            this._owner.prepareHeaderCell(cell, indexPath);
            this._owner._preparingCell = false;
        }
        else if (kind === "footer" && (this._owner.footerItemTemplate !== undefined || this._owner.itemViewLoader !== undefined)) {
            cell = listView.dequeueReusableSupplementaryViewOfKindWithReuseIdentifierForIndexPath(kind, NSString.stringWithCString("footer"), indexPath);
            this._owner._preparingCell = true;
            this._owner.prepareFooterCell(cell, indexPath);
            this._owner._preparingCell = false;
        }
        return cell;
    };
    TKListViewDataSourceImpl.ObjCProtocols = [TKListViewDataSource];
    return TKListViewDataSourceImpl;
})(NSObject);
var ExtendedHeaderCell = (function (_super) {
    __extends(ExtendedHeaderCell, _super);
    function ExtendedHeaderCell() {
        _super.apply(this, arguments);
    }
    ExtendedHeaderCell.new = function () {
        var instance = _super.new.call(this);
        return instance;
    };
    ExtendedHeaderCell.class = function () {
        return ExtendedHeaderCell;
    };
    Object.defineProperty(ExtendedHeaderCell.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (value) {
            this._view = value;
        },
        enumerable: true,
        configurable: true
    });
    return ExtendedHeaderCell;
})(TKListViewHeaderCell);
var ExtendedFooterCell = (function (_super) {
    __extends(ExtendedFooterCell, _super);
    function ExtendedFooterCell() {
        _super.apply(this, arguments);
    }
    ExtendedFooterCell.new = function () {
        var instance = _super.new.call(this);
        return instance;
    };
    ExtendedFooterCell.class = function () {
        return ExtendedFooterCell;
    };
    Object.defineProperty(ExtendedFooterCell.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (value) {
            this._view = value;
        },
        enumerable: true,
        configurable: true
    });
    return ExtendedFooterCell;
})(TKListViewFooterCell);
var ExtendedLoadOnDemandCell = (function (_super) {
    __extends(ExtendedLoadOnDemandCell, _super);
    function ExtendedLoadOnDemandCell() {
        _super.apply(this, arguments);
    }
    ExtendedLoadOnDemandCell.new = function () {
        var instance = _super.new.call(this);
        return instance;
    };
    ExtendedLoadOnDemandCell.class = function () {
        return ExtendedLoadOnDemandCell;
    };
    ExtendedLoadOnDemandCell.prototype.systemLayoutSizeFittingSize = function (targetSize) {
        if (this._view) {
            return CGSizeMake(this._view.getMeasuredWidth(), this._view.getMeasuredHeight());
        }
        var newSize = CGSizeMake(this.owner.ios.bounds.size.width, 100);
        return newSize;
    };
    Object.defineProperty(ExtendedLoadOnDemandCell.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (value) {
            this._view = value;
        },
        enumerable: true,
        configurable: true
    });
    return ExtendedLoadOnDemandCell;
})(TKListViewLoadOnDemandCell);
/////////////////////////////////////////////////////////////
// ExtendedListViewCell
var ExtendedListViewCell = (function (_super) {
    __extends(ExtendedListViewCell, _super);
    function ExtendedListViewCell() {
        _super.apply(this, arguments);
        this.touchStarted = false;
    }
    ExtendedListViewCell.new = function () {
        var instance = _super.new.call(this);
        return instance;
    };
    ExtendedListViewCell.class = function () {
        return ExtendedListViewCell;
    };
    ExtendedListViewCell.prototype.systemLayoutSizeFittingSize = function (targetSize) {
        this.owner._preparingCell = true;
        var dimensions = this.owner.layoutCell(this, undefined);
        this.owner._preparingCell = false;
        return CGSizeMake(dimensions.measuredWidth, dimensions.measuredHeight);
    };
    // This shows in the profiling. Can it be avoided?
    ExtendedListViewCell.prototype.touchesBeganWithEvent = function (touches, event) {
        _super.prototype.touchesBeganWithEvent.call(this, touches, event);
        if (touches.count !== 1) {
            this.touchStarted = false;
            return;
        }
        this.touchStarted = true;
    };
    // This shows in the profiling. Can it be avoided?
    ExtendedListViewCell.prototype.touchesMovedWithEvent = function (touches, event) {
        _super.prototype.touchesMovedWithEvent.call(this, touches, event);
        this.touchStarted = false;
    };
    ExtendedListViewCell.prototype.touchesEndedWithEvent = function (touches, event) {
        _super.prototype.touchesEndedWithEvent.call(this, touches, event);
        if (touches.count !== 1 || this.touchStarted === false) {
            return;
        }
        var allObjects = touches.allObjects;
        var touchEvent = allObjects.objectAtIndex(0);
        var currentIndexPath = this.owner.ios.indexPathForCell(this);
        if (touchEvent.tapCount === 1) {
            if (this.owner.hasListeners(commonModule.RadListView.itemTapEvent)) {
                var args = {
                    eventName: commonModule.RadListView.itemTapEvent,
                    object: this.myContentView,
                    itemIndex: currentIndexPath.row,
                    groupIndex: currentIndexPath.section
                };
                this.owner.notify(args);
            }
        }
    };
    ExtendedListViewCell.prototype.getCurrentIndexPath = function () {
        return this.owner.ios.indexPathForCell(this);
    };
    return ExtendedListViewCell;
})(TKListViewCell);
/////////////////////////////////////////////////////////////
// ListView
var RadListView = (function (_super) {
    __extends(RadListView, _super);
    function RadListView() {
        _super.call(this);
        this._realizedCells = new Map();
        this._heights = new Array();
        this._ios = TKListView.new();
        this._ios.autoresizingMask = UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
        this._ios.cellSwipeTreshold = 30; //the treshold after which the cell will autoswipe to the end and will not jump back to the center.
        this._delegate = TKListViewDelegateImpl.new().initWithOwner(this);
        this._dataSource = TKListViewDataSourceImpl.new().initWithOwner(this); //weak ref
        this._ios.dataSource = this._dataSource;
        this._ios.pullToRefreshView.backgroundColor = (new colorModule.Color("White")).ios;
        this._ios.registerClassForCellWithReuseIdentifier(ExtendedListViewCell.class(), "defaultCell");
        this._ios.registerClassForSupplementaryViewOfKindWithReuseIdentifier(ExtendedHeaderCell.class(), TKListViewElementKindSectionHeader, NSString.stringWithCString("header"));
        this._ios.registerClassForSupplementaryViewOfKindWithReuseIdentifier(ExtendedFooterCell.class(), TKListViewElementKindSectionFooter, NSString.stringWithCString("footer"));
        this._ios.registerLoadOnDemandCell(ExtendedLoadOnDemandCell.class());
        this.synchCellReorder();
        this.synchCellSwipe();
        this.synchLoadOnDemandBufferSize();
        this.synchLoadOnDemandMode();
        this.synchPullToRefresh();
        this.synchSelection();
        this.synchSelectionBehavior();
        this.synchReorderMode();
    }
    Object.defineProperty(RadListView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    RadListView.prototype.setHeightForCell = function (index, value) {
        this._heights[index] = value;
    };
    RadListView.prototype.selectAll = function () {
        for (var i = 0; i < this.items.length; i++) {
            var indexPathToSelect = NSIndexPath.indexPathForRowInSection(i, 0);
            this._ios.selectItemAtIndexPathAnimatedScrollPosition(indexPathToSelect, false, UICollectionViewScrollPosition.UICollectionViewScrollPositionNone);
        }
    };
    RadListView.prototype.deselectAll = function () {
        for (var i = 0; i < this.items.length; i++) {
            var indexPathToSelect = NSIndexPath.indexPathForRowInSection(i, 0);
            this._ios.deselectItemAtIndexPathAnimated(indexPathToSelect, false);
        }
    };
    RadListView.prototype.isItemSelected = function (item) {
        var indexOfTargetItem = this.items.indexOf(item);
        var selectedIndexPaths = this._ios.indexPathsForSelectedItems;
        for (var i = 0; i < selectedIndexPaths.count; i++) {
            var indexPath = selectedIndexPaths.objectAtIndex(i);
            if (indexOfTargetItem === indexPath.row) {
                return true;
            }
        }
        return false;
    };
    RadListView.prototype.selectItemAt = function (index) {
        var indexPathToSelect = NSIndexPath.indexPathForRowInSection(index, 0);
        this._ios.selectItemAtIndexPathAnimatedScrollPosition(indexPathToSelect, false, UICollectionViewScrollPosition.UICollectionViewScrollPositionNone);
    };
    RadListView.prototype.deselectItemAt = function (index) {
        var indexPathToSelect = NSIndexPath.indexPathForRowInSection(index, 0);
        this._ios.deselectItemAtIndexPathAnimated(indexPathToSelect, false);
    };
    RadListView.prototype.getViewForItem = function (item) {
        if (item === undefined) {
            throw new Error("Item must be an object from the currently assigned source.");
        }
        var cells = this._realizedCells.values();
        for (var i = 0; i < cells.length; i++) {
            if (cells[i].view.bindingContext === item) {
                return cells[i].view;
            }
        }
        return undefined;
    };
    RadListView.prototype.getSelectedItems = function () {
        var selectedIndexPaths = this._ios.indexPathsForSelectedItems;
        var result = new Array();
        for (var i = 0; i < selectedIndexPaths.count; i++) {
            var indexPath = selectedIndexPaths.objectAtIndex(i);
            result.push(this.getItemAtIndex(indexPath.row));
        }
        return result;
    };
    RadListView.prototype._onBindingContextChanged = function (oldValue, newValue) {
        _super.prototype._onBindingContextChanged.call(this, oldValue, newValue);
        // We need this to calculate the header-footer size based on bindings to the context.
        this._updateHeaderFooterAvailability();
    };
    RadListView.prototype._updateHeaderFooterAvailability = function () {
        if (this.ios.layout) {
            var tempView = this.getViewForViewType(commonModule.ListViewViewTypes.HeaderView);
            if (tempView) {
                this._addView(tempView);
                tempView.bindingContext = this.bindingContext;
                var measuredSize = this.measureCell(tempView);
                this.ios.layout.headerReferenceSize = CGSizeMake(measuredSize.measuredWidth, measuredSize.measuredHeight);
                this._removeView(tempView);
            }
            else {
                this.ios.layout.headerReferenceSize = CGSizeMake(0, 0);
            }
            tempView = this.getViewForViewType(commonModule.ListViewViewTypes.FooterView);
            if (tempView) {
                this._addView(tempView);
                tempView.bindingContext = this.bindingContext;
                var measuredSize = this.measureCell(tempView);
                this.ios.layout.footerReferenceSize = CGSizeMake(measuredSize.measuredWidth, measuredSize.measuredHeight);
                this._removeView(tempView);
            }
            else {
                this.ios.layout.footerReferenceSize = CGSizeMake(0, 0);
            }
            this.refresh();
        }
    };
    RadListView.prototype.onReorderModeChanged = function (data) {
        this.synchReorderMode();
    };
    RadListView.prototype.onListViewLayoutChanged = function (data) {
        if (data.oldValue) {
            data.oldValue.reset();
        }
        var newLayout = data.newValue;
        if (newLayout) {
            this.ios.layout = data.newValue.ios;
            this.refresh();
            newLayout.init(this);
            this._updateHeaderFooterAvailability();
            this._ios.cellSwipeLimits = (newLayout.scrollDirection === "Horizontal") ? UIEdgeInsetsFromString("{60, 0, 60, 0}") : UIEdgeInsetsFromString("{0, 60, 0, 60}");
        }
    };
    RadListView.prototype.onItemTemplateChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        this.refresh();
    };
    RadListView.prototype.onLoadOnDemandItemTemplateChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        if (this.loadOnDemandMode === commonModule.ListViewLoadOnDemandMode.Auto) {
            //this._ios.loadOnDemandView = builder.parse(this.loadOnDemandItemTemplate).ios;
            var loadOnDemandView = this.getViewForViewType(commonModule.ListViewViewTypes.LoadOnDemandView);
            if (loadOnDemandView) {
                this._ios.loadOnDemandView = loadOnDemandView.ios;
            }
        }
        this.refresh();
    };
    RadListView.prototype.onItemSwipeTemplateChanged = function (data) {
        if (!data.newValue) {
            return;
        }
        this.refresh();
    };
    RadListView.prototype.onMultipleSelectionChanged = function (data) {
        this.synchSelection();
    };
    RadListView.prototype.onHeaderItemTemplateChanged = function (data) {
        _super.prototype.onHeaderItemTemplateChanged.call(this, data);
        this._updateHeaderFooterAvailability();
    };
    RadListView.prototype.onFooterItemTemplateChanged = function (data) {
        _super.prototype.onFooterItemTemplateChanged.call(this, data);
        this._updateHeaderFooterAvailability();
    };
    RadListView.prototype.synchReorderMode = function () {
        if (this.reorderMode.toLowerCase() === commonModule.ListViewReorderMode.Drag) {
            this._ios.reorderMode = TKListViewReorderMode.TKListViewReorderModeWithHandle;
        }
        else if (this.reorderMode.toLowerCase() === commonModule.ListViewReorderMode.HoldAndDrag) {
            this._ios.reorderMode = TKListViewReorderMode.TKListViewReorderModeWithLongPress;
        }
        this.refresh();
    };
    RadListView.prototype.synchSelection = function () {
        this.ios.allowsMultipleSelection = (this.multipleSelection ? true : false);
    };
    RadListView.prototype.onItemReorderChanged = function (data) {
        this.synchCellReorder();
    };
    RadListView.prototype.synchCellReorder = function () {
        this.ios.allowsCellReorder = (this.itemReorder ? true : false);
    };
    RadListView.prototype.onItemSwipeChanged = function (data) {
        this.synchCellSwipe();
    };
    RadListView.prototype.synchCellSwipe = function () {
        this.ios.allowsCellSwipe = (this.itemSwipe ? true : false);
    };
    RadListView.prototype.onPullToRefreshChanged = function (data) {
        this.synchPullToRefresh();
    };
    RadListView.prototype.synchPullToRefresh = function () {
        this.ios.allowsPullToRefresh = (this.pullToRefresh ? true : false);
        ;
    };
    RadListView.prototype.onLoadOnDemandModeChanged = function (data) {
        this.synchLoadOnDemandMode();
    };
    RadListView.prototype.synchLoadOnDemandMode = function () {
        if (this.loadOnDemandMode) {
            if (commonModule.ListViewLoadOnDemandMode.Auto === this.loadOnDemandMode) {
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeAuto;
            }
            else if (commonModule.ListViewLoadOnDemandMode.Manual === this.loadOnDemandMode) {
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeManual;
            }
            else
                this.ios.loadOnDemandMode = TKListViewLoadOnDemandMode.TKListViewLoadOnDemandModeNone;
        }
    };
    RadListView.prototype.onLoadOnDemandBufferSizeChanged = function (data) {
        this.synchLoadOnDemandBufferSize();
    };
    RadListView.prototype.synchLoadOnDemandBufferSize = function () {
        if (this.loadOnDemandBufferSize !== undefined) {
            this.ios.loadOnDemandBufferSize = this.loadOnDemandBufferSize;
        }
    };
    RadListView.prototype.onSelectionBehaviorChanged = function (data) {
        this.synchSelectionBehavior();
    };
    RadListView.prototype.synchSelectionBehavior = function () {
        if (this.selectionBehavior) {
            if (commonModule.ListViewSelectionBehavior.Press === this.selectionBehavior) {
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorPress;
            }
            else if (commonModule.ListViewSelectionBehavior.LongPress === this.selectionBehavior) {
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorLongPress;
            }
            else
                this.ios.selectionBehavior = TKListViewSelectionBehavior.TKListViewSelectionBehaviorNone;
        }
    };
    RadListView.prototype.getDataItem = function (index) {
        var items = this.items;
        return items.getItem ? items.getItem(index) : items[index]; //todo: conside usage of DataSource instance here
    };
    RadListView.prototype.prepareItem = function (item, index) {
        if (item) {
            item.bindingContext = this.getDataItem(index);
        }
    };
    RadListView.prototype._onSizeChanged = function () {
        _super.prototype._onSizeChanged.call(this);
        this._updateHeaderFooterAvailability();
        this._ios.reloadData();
    };
    RadListView.prototype.requestLayout = function () {
        // When preparing cell don't call super - no need to invalidate our measure when cell desiredSize is changed.
        if (!this._preparingCell) {
            _super.prototype.requestLayout.call(this);
        }
    };
    Object.defineProperty(RadListView.prototype, "_childrenCount", {
        get: function () {
            var count = 0;
            if (this._realizedCells) {
                var currentSize = this._realizedCells.size;
                if (this.itemSwipe === true) {
                    return currentSize * 2;
                }
                return currentSize;
            }
            return count;
        },
        enumerable: true,
        configurable: true
    });
    RadListView.prototype._eachChildView = function (callback) {
        if (this._realizedCells) {
            this._realizedCells.forEach(function (value, key) {
                callback(value.view.itemView);
                if (value.view.itemSwipeView) {
                    callback(value.view.itemSwipeView);
                }
            }, this);
        }
    };
    RadListView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.delegate = this._delegate;
    };
    RadListView.prototype.onUnloaded = function () {
        this._ios.delegate = null;
    };
    RadListView.prototype.scrollToIndex = function (index) {
        if (this._ios) {
            this._ios.scrollToItemAtIndexPathAtScrollPositionAnimated(NSIndexPath.indexPathForItemInSection(index, 0), UICollectionViewScrollPosition.UICollectionViewScrollPositionTop, false);
        }
    };
    RadListView.prototype.notifyPullToRefreshFinished = function () {
        this.ios.didRefreshOnPull();
    };
    RadListView.prototype.notifyLoadOnDemandFinished = function () {
        this.ios.didLoadDataOnDemand();
    };
    RadListView.prototype.notifySwipeToExecuteFinished = function () {
        this.ios.endSwipe(true);
    };
    RadListView.prototype.refresh = function () {
        this._realizedCells.clear();
        this._ios.reloadData();
    };
    RadListView.prototype.onSourceCollectionChanged = function (data) {
        if (data.action === observableArray.ChangeType.Delete) {
            var nativeSource = NSMutableArray.new();
            nativeSource.addObject(NSIndexPath.indexPathForRowInSection(data.index, 0));
            this.removeUnusedCells(data.removed);
            this.ios.deleteItemsAtIndexPaths(nativeSource);
        }
        else if (data.action === observableArray.ChangeType.Add) {
            var nativeSource = NSMutableArray.new();
            for (var i = 0; i < data.addedCount; i++) {
                nativeSource.addObject(NSIndexPath.indexPathForRowInSection(data.index + i, 0));
            }
            this.ios.insertItemsAtIndexPaths(nativeSource);
        }
        else if (data.action === observableArray.ChangeType.Splice) {
            if (data.removed && (data.removed.length > 0)) {
                var nativeSource = NSMutableArray.new();
                for (var i = 0; i < data.removed.length; i++) {
                    nativeSource.addObject(NSIndexPath.indexPathForRowInSection(data.index + i, 0));
                }
                this.removeUnusedCells(data.removed);
                this.ios.deleteItemsAtIndexPaths(nativeSource);
            }
            else {
                var nativeSource = NSMutableArray.new();
                for (var i = 0; i < data.addedCount; i++) {
                    nativeSource.addObject(NSIndexPath.indexPathForRowInSection(data.index + i, 0));
                }
                this.ios.insertItemsAtIndexPaths(nativeSource);
            }
        }
        else if (data.action === observableArray.ChangeType.Update) {
            _super.prototype.onSourceCollectionChanged.call(this, data);
        }
    };
    RadListView.prototype.hasFixedItemSize = function () {
        var listViewLayout = this.listViewLayout;
        if (listViewLayout.scrollDirection === commonModule.ListViewScrollDirection.Vertical) {
            return !isNaN(listViewLayout.itemHeight);
        }
        if (listViewLayout.scrollDirection === commonModule.ListViewScrollDirection.Horizontal) {
            return !isNaN(listViewLayout.itemWidth);
        }
        return false;
    };
    RadListView.prototype.removeUnusedCells = function (removedDataItems) {
        var cellsToDelete = new Array();
        this._realizedCells.forEach(function (value, key) {
            if (removedDataItems.indexOf(value.view.itemView.bindingContext) !== -1) {
                cellsToDelete.push(value);
            }
        }, this);
        for (var i = 0; i < cellsToDelete.length; i++) {
            this._realizedCells.delete(cellsToDelete[i].tag);
        }
    };
    RadListView.prototype.getLoadOnDemandItemTemplateContent = function () {
        //return builder.parse(this.loadOnDemandItemTemplate, this);
        return this.getViewForViewType(commonModule.ListViewViewTypes.LoadOnDemandView);
    };
    RadListView.prototype.getItemTemplateContent = function () {
        var cellViews = new Object();
        //cellViews.itemView = builder.parse(this.itemTemplate, this);
        cellViews.itemView = this.getViewForViewType(commonModule.ListViewViewTypes.ItemView);
        //cellViews.itemSwipeView = builder.parse(this.itemSwipeTemplate, this);
        cellViews.itemSwipeView = this.getViewForViewType(commonModule.ListViewViewTypes.ItemSwipeView);
        return cellViews;
    };
    RadListView.prototype.layoutHeaderFooterCell = function (cell) {
        var itemViewDimensions = this.measureCell(cell.view);
        var cellView = cell.view;
        if (cellView) {
            viewModule.View.layoutChild(this, cellView, 0, 0, itemViewDimensions.measuredWidth, itemViewDimensions.measuredHeight);
        }
    };
    RadListView.prototype.layoutLoadOnDemandCell = function (cell) {
        var itemViewDimensions = this.measureCell(cell.view);
        var cellView = cell.view;
        if (cellView) {
            viewModule.View.layoutChild(this, cellView, 0, 0, itemViewDimensions.measuredWidth, itemViewDimensions.measuredHeight);
        }
    };
    RadListView.prototype.layoutCell = function (cell, indexPath) {
        var itemViewDimensions = this.measureCell(cell.view.itemView, indexPath);
        var cellView = cell.view.itemView;
        if (cellView && cellView.isLayoutRequired) {
            viewModule.View.layoutChild(this, cellView, 0, 0, itemViewDimensions.measuredWidth, itemViewDimensions.measuredHeight);
        }
        var swipeViewDimensions = this.measureCell(cell.view.itemSwipeView, { width: itemViewDimensions.measuredWidth, height: itemViewDimensions.measuredHeight });
        var backgroundView = cell.view.itemSwipeView;
        if (backgroundView && backgroundView.isLayoutRequired) {
            viewModule.View.layoutChild(this, backgroundView, 0, 0, swipeViewDimensions.measuredWidth, swipeViewDimensions.measuredHeight);
        }
        return itemViewDimensions;
    };
    RadListView.prototype.measureCell = function (cellView, sizeRestriction) {
        if (cellView) {
            var listViewLayout = this.listViewLayout;
            var itemWidth = isNaN(listViewLayout.itemWidth) ? undefined : listViewLayout.itemWidth;
            var itemHeight = isNaN(listViewLayout.itemHeight) ? undefined : listViewLayout.itemHeight;
            if (sizeRestriction !== undefined) {
                itemWidth = sizeRestriction.width;
                itemHeight = sizeRestriction.height;
            }
            var heightSpec, widthSpec;
            var spanCount = !isNaN(listViewLayout.spanCount) ? listViewLayout.spanCount : 1;
            if (listViewLayout.scrollDirection === "Vertical") {
                itemWidth = (itemWidth === undefined) ? this.getMeasuredWidth() / spanCount : itemWidth;
                if (itemHeight === undefined) {
                    heightSpec = utilsModule.layout.makeMeasureSpec(0, utilsModule.layout.UNSPECIFIED);
                }
                else {
                    heightSpec = utilsModule.layout.makeMeasureSpec(itemHeight, utilsModule.layout.EXACTLY);
                }
                widthSpec = utilsModule.layout.makeMeasureSpec(itemWidth, utilsModule.layout.EXACTLY);
            }
            else {
                itemHeight = (itemHeight === undefined) ? this.getMeasuredHeight() / spanCount : itemHeight;
                if (itemWidth === undefined) {
                    widthSpec = utilsModule.layout.makeMeasureSpec(0, utilsModule.layout.UNSPECIFIED);
                }
                else {
                    widthSpec = utilsModule.layout.makeMeasureSpec(itemWidth, utilsModule.layout.EXACTLY);
                }
                heightSpec = utilsModule.layout.makeMeasureSpec(itemHeight, utilsModule.layout.EXACTLY);
            }
            return viewModule.View.measureChild(this, cellView, widthSpec, heightSpec);
        }
        return undefined;
    };
    RadListView.prototype.prepareLoadOnDemandCell = function (tableCell, indexPath) {
        if (tableCell.tag === 0) {
            tableCell.tag = indexPath.row + 1;
        }
        this._realizedCells.set(tableCell.tag, tableCell);
        if (tableCell.view === undefined) {
            var loadOnDemandView = this.getLoadOnDemandItemTemplateContent();
            if (loadOnDemandView) {
                tableCell.view = loadOnDemandView;
                tableCell.view.bindingContext = this.bindingContext;
                this.layoutLoadOnDemandCell(tableCell);
                tableCell.contentView.addSubview(tableCell.view.ios);
                this._addView(tableCell.view);
            }
        }
    };
    RadListView.prototype.prepareHeaderCell = function (headerCell, indexPath) {
        //this.prepareHeaderFooterCell(headerCell, this.headerItemTemplate, indexPath);
        this.prepareHeaderFooterCell(headerCell, commonModule.ListViewViewTypes.HeaderView, indexPath);
    };
    RadListView.prototype.prepareFooterCell = function (footerCell, indexPath) {
        //this.prepareHeaderFooterCell(tableCell, this.footerItemTemplate, indexPath);
        this.prepareHeaderFooterCell(footerCell, commonModule.ListViewViewTypes.FooterView, indexPath);
    };
    RadListView.prototype.prepareHeaderFooterCell = function (cell, viewType, indexPath) {
        if (cell.tag === 0) {
            cell.tag = indexPath.row + 1;
        }
        this._realizedCells.set(cell.tag, cell);
        if (cell.view === undefined || cell.view.parent === undefined) {
            if (cell.view !== undefined) {
                cell.view.ios.removeFromSuperview();
                cell.view = undefined;
            }
            //cell.view = builder.parse(template, this);
            cell.view = this.getViewForViewType(viewType);
            if (cell.view) {
                cell.view.bindingContext = this.bindingContext;
                this.layoutHeaderFooterCell(cell);
                cell.contentView.addSubview(cell.view.ios);
                this._addView(cell.view);
            }
        }
    };
    RadListView.prototype.prepareCell = function (tableCell, indexPath) {
        var cell = tableCell;
        if (cell.tag === 0) {
            cell.tag = indexPath.row + 1;
        }
        this._realizedCells.set(tableCell.tag, cell);
        if (cell.view === undefined) {
            cell.view = this.getItemTemplateContent();
            if (this.reorderMode.toLowerCase() === commonModule.ListViewReorderMode.Drag) {
                var reorderHandle = undefined;
                cell.view.itemView._eachChildView(function (view) {
                    if (view instanceof ReorderHandle) {
                        reorderHandle = view;
                        return false;
                    }
                    return true;
                });
                if (reorderHandle) {
                    cell.reorderHandle = reorderHandle.ios;
                }
            }
        }
        if (cell.view.itemView && !cell.view.itemView.parent) {
            if (cell.myContentView) {
                cell.myContentView.ios.removeFromSuperview();
                cell.myContentView = null;
            }
            cell.myContentView = cell.view.itemView;
            if (cell.contentView.subviews && cell.contentView.subviews.count > 0) {
                cell.contentView.insertSubviewBelowSubview(cell.view.itemView.ios, cell.contentView.subviews.objectAtIndex(0));
            }
            else {
                cell.contentView.addSubview(cell.view.itemView.ios);
            }
            this._addView(cell.view.itemView);
        }
        this.prepareItem(cell.view.itemView, indexPath.row);
        if (cell.view.itemSwipeView && !cell.view.itemSwipeView.parent) {
            if (cell.myBackgroundView) {
                cell.myBackgroundView.ios.removeFromSuperview();
                cell.myBackgroundView = null;
            }
            cell.myBackgroundView = cell.view.itemSwipeView;
            cell.swipeBackgroundView.addSubview(cell.view.itemSwipeView.ios);
            this._addView(cell.view.itemSwipeView);
        }
        this.prepareItem(cell.view.itemSwipeView, indexPath.row);
        var args = { eventName: commonModule.RadListView.itemLoadingEvent, itemIndex: indexPath.row, view: cell.view.itemView, ios: cell };
        this.notify(args);
    };
    return RadListView;
})(commonModule.RadListView);
exports.RadListView = RadListView;
