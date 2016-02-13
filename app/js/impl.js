/**
 * This is where you add new components to the application
 * you don't need to sweat the dependency order (that is what RequireJS is for)
 * but implementations' `define`s placed elsewhere void the warranty
 */
define([
    'services/auth-service'
    ,'services/captcha-service'
    ,'services/google-maps-locale-service'
    ,'services/image-upload-service'
    ,'services/locale-service'
    ,'services/util-services'
    ,'services/video-upload-service'
    ,'services/cookie-service'
    ,'services/nearby-cities-service'
    ,'services/wallet-service'
    ,'services/vendor-services'
    ,'services/item-data-services'
    ,'services/share-item-service'
    ,'services/window-location-service'
    ,'controllers/sso/auth-ctrl'
    ,'controllers/sell/category-ctrl'
    ,'controllers/sell/specifications-ctrl'
    ,'controllers/sso/confirmEmail-ctrl'
    ,'controllers/home-ctrl'
    ,'controllers/geo-ctrl'
    ,'controllers/sell/image-ctrl'
    ,'controllers/sell/listingType-ctrl'
    ,'controllers/sso/forgotPassword-ctrl'
    ,'controllers/sso/resetPassword-ctrl'
    ,'controllers/sso/changePassword-ctrl'
    ,'controllers/sell/sell-ctrl'
    ,'controllers/sell/description-ctrl'
    ,'controllers/sell/video-ctrl'
    ,'controllers/sell/payment-ctrl'
    ,'controllers/item/view-ctrl'
    ,'directives/directives'
    ,'directives/is-focused-directive'
    ,'directives/maps-input-directive'
    ,'filters/filters'
    ], function () {   }
);
