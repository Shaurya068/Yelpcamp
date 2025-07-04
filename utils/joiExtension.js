const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Extend Joi to add `.escapeHTML()` method
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            method() {
                return this.$_addRule({ name: 'escapeHTML' });
            },
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHTML', { value });
                }
                return clean;
            }
        }
    }
});

module.exports = BaseJoi.extend(extension); 