//
// import xss from 'xss';
// import validator from "validator/es";
//
// const xssMiddleware = (req, res, next) => {
//     const sanitizeInputs = (input) => {
//         if (input === null || input === undefined) return input;
//
//         if (typeof input === 'string') {
//             return xss(input, {
//                 whiteList: {}
//                 stripIgnoreTag: true,
//                 stripIgnoreTagBody: ['script']
//             })
//         }
//
//         if (Array.isArray(input)) {
//             return input.map(sanitizeInputs);
//         }
//
//         if (typeof input === 'object') {
//             const sanitizeObject = {};
//             for (const key in input) {
//                 sanitizeObject[key] = sanitizeInputs(input[key]);
//             }
//             return sanitizeObject;
//         }
//
//         return input;
//     }
//
//     const detectXSSPattern = (input) => {
//         if (input === null || input === undefined) return false;
//         const xssPatterns = [
//             /<script.*?>.*?<\/script>/gmi,
//             /<script.*?\/>/gmi,
//             /<script.*?>.*?/gmi,
//             /<script.*?/gmi,
//             /<script.*?src.*?>/gmi,
//             /<script.*?src.*?/,
//             /eval\((.*?)\)/gmi,
//             /&#x.{1,8};/gmi,
//         ];
//
//         // check pattern
//         const checkPattern = (value) => typeof value === 'string' && xssPatterns.some(pattern => pattern.test(value));
//
//         const recursivePatternCheck = (data) => {
//             if (data === null || data === undefined) return false;
//             if (Array.isArray(data)) {
//                 return data.some(recursivePatternCheck)
//             }
//             if (typeof data === 'object') {
//                 return Object.values(data).some(recursivePatternCheck);
//             }
//
//             return checkPattern(data);
//         }
//
//         return recursivePatternCheck(input);
//     }
//
//     req.body = sanitizeInputs(req.body);
//     req.query = sanitizeInputs(req.query);
//     req.params = sanitizeInputs(req.params);
//
//     if (detectXSSPattern(req.body) || detectXSSPattern(req.query) || detectXSSPattern(req.params)) {
//         return res.status(400).json({ error: 'Invalid input' });
//     }
//
//     res.locals.originalJson = res.json;
//     res.json = (body) => {
//         const sanitizedBody = sanitizeInputs(body);
//         return res.locals.originalJson.call(this, sanitizedBody)
//     }
//
//     next();
// }
