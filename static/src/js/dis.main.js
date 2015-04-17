/*global jQuery */

/* DIS/PLAY Script
 Author's name: ...
 Modified by:
 Client name: ...
 Date of creation: ...
 */

var DIS = DIS || {};

(function ($, DIS, window) {
    "use strict";

    function init() {

        // Let's say we want to instantiate our ExampleModule (see dis.module.example.js) on all occurrences
        // of the "article" element. We can do this like so:
        $(".project-item").each(function () {

            var project = new DIS.ProjectHandler({ container: this });

            // However, you can, of course, run a public function on the new module at once:
            //project.someFunction();

            // This, for example, is how you'd trigger the "refresh"-event:
            $(this).trigger("dis.refresh");
        });

        window.console.log("Everything is ready!");
    }

    $(function () {
        init();
    });


}(jQuery, DIS, window));

