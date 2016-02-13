define(['./dependency'], function (dep) {
    return function MyController() {
        return {
            add: dep
        }
    };

});
