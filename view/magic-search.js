/**
 * Created by A6252532 on 20/11/2015.
 */
(function ($, window, document){
    'use strict';
    var magicsearch = {};
    magicsearch.APP_NAME = "MagicSearch";
    magicsearch.APP_AUTHOR = "Vincent DAGOURY";
    magicsearch.APP_VERSION = "0.1b";
    magicsearch.CONTAINER_NAME = "#magic-search";
    magicsearch.ATTR_FOR_REF_MENU = "data-ref-menu";
    magicsearch.PATTERN_FOR_HREF = "lien";
    magicsearch.SHOW_DIV_DELAY = 500;
    magicsearch.SHOW_ITEM_DELAY = 100;
    magicsearch.QUESTION_MARK = "?";
    magicsearch.CLOSING_MARK = "X";
    magicsearch.HTML_CLOSE_BUTTON = "";

    // Default fake content
    magicsearch.content = [
        {
            "title":"Home",
            "href":"/index.html"
        }
        ,{
            "title":"About",
            "href":"/about.html"
        }
    ];

    // Sorting function for magicsearch.content based on title
    function compare(a,b) {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    }

    /* build content of magicsearch.content */
    magicsearch.buildContent = function($container) {
        // Cache the Window object
        var originalMenuRef = $container.attr(magicsearch.ATTR_FOR_REF_MENU);
        var $originalMenuItems = $("#" + originalMenuRef + " a");
        // Start analyzing and build menu
        if (originalMenuRef && $originalMenuItems) {
            // Append links in magic-search tab
            magicsearch.content = [];
            for (var i = 0; i < $originalMenuItems.length; i++) {
                var item = $originalMenuItems[i];
                if ( item.href.match(magicsearch.PATTERN_FOR_HREF)) {
                    magicsearch.content.push({
                        "title": item.innerText
                        , "href": item.href
                    });
                }
            }
            // Sort function
            magicsearch.content.sort(compare);
        }
        return true;
    };

    /* init */
    magicsearch.init = function () {
        // Cache the Window object and DOM objects
        var $window = $(window);
        // Get the main container
        var $container = $(magicsearch.CONTAINER_NAME);
        // Content of magicsearch
        var $containerList, $containerMetaSearch, $closeButton;
        // We need to have something to do : a content for magicsearch to display
        if ( $container.length > 0) {
            // Fresh content
            $container.empty();
            // Call buildContent
            magicsearch.buildContent($container);

            /* Create objects */
            // Close button
            $closeButton = $container.append('<div id="closeButton" title="Cliquez pour utiliser le menu rapide !">'+magicsearch.QUESTION_MARK+'</div>').find("#closeButton");
            // Create ul, MetaSearch input, the list of items
            $containerMetaSearch = $container.append('<ul><li><input type="text" id="metaSearch" placeholder="Que cherchez vous ?"/></li></ul><ul></ul>').find("#metaSearch");
            $containerList = $container.find('ul:last');

            // Append item's list in magicsearch menu
            var item = {};
            for (var i = 0; i < magicsearch.content.length; i++) {
                item = magicsearch.content[i];
                $containerList.append('<li><a href="' + item.href +'"><span class="item-title">'+item.title+'</span></a></li>');
            }

            /* Define closebutton action */
            $closeButton.click(function (event) {
                var that = $(this);
                event.preventDefault();
                if ($(this).text() === magicsearch.CLOSING_MARK ) {
                    $containerList.delay(magicsearch.SHOW_ITEM_DELAY).fadeOut("fast");
                    $containerMetaSearch.delay(magicsearch.SHOW_ITEM_DELAY).fadeOut("fast");
                    $(this).text(magicsearch.QUESTION_MARK);
                } else {
                    $containerList.delay(magicsearch.SHOW_ITEM_DELAY).fadeIn("fast");
                    $containerMetaSearch.delay(magicsearch.SHOW_ITEM_DELAY).fadeIn("fast");
                    $containerMetaSearch.val("");
                    $(this).text(magicsearch.CLOSING_MARK);
                }
            });

            /* Input behavior */
            var searchInput, text = "";
            $containerMetaSearch
                .unbind('keypress keyup')
                .bind('keypress keyup', function(event) {
                    // Get the input content
                    var valThis = $(this).val().toLowerCase();
                    // In input is empty the list is displayed
                    if (valThis.length === 0) {
                        $containerList.children("li").each(function(){
                            $(this).slideDown();
                        })
                    }
                    // Start search up to 3rd characters
                    if (valThis.length < 1 && event.keyCode != 13) {
                        return; }
                    else {
                        searchInput = $(this);
                        text = "";
                        $containerList.children("li").each(function () {
                            text = $(this).text().toLowerCase();
                            (text.indexOf(valThis) >= 0) ? $(this).slideDown() : $(this).slideUp();
                        });
                        $containerList.fadeIn();
                    }
                    return;
                });

            /* Define display after SHOW_DIV_DELAY is timedout*/
            setTimeout(
                function() {
                    $containerList.hide();
                    $containerMetaSearch.hide();
                    $container.show();
                    $closeButton.fadeIn("slow");
                }
                ,magicsearch.SHOW_DIV_DELAY);
        }
    };
    /* Launcher : when DOM is ready */
    $(function(){
        magicsearch.init();
    })
})($, window, document);
