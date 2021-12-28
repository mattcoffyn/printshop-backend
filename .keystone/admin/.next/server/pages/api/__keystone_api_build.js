"use strict";
(() => {
var exports = {};
exports.id = 638;
exports.ids = [638];
exports.modules = {

/***/ 8805:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "config": () => (/* reexport */ keystone),
  "default": () => (/* binding */ _keystone_api_build)
});

;// CONCATENATED MODULE: external "@keystone-6/auth"
const auth_namespaceObject = require("@keystone-6/auth");
;// CONCATENATED MODULE: external "@keystone-6/core"
const core_namespaceObject = require("@keystone-6/core");
;// CONCATENATED MODULE: external "@keystone-6/core/session"
const session_namespaceObject = require("@keystone-6/core/session");
;// CONCATENATED MODULE: external "@keystone-6/core/fields"
const fields_namespaceObject = require("@keystone-6/core/fields");
;// CONCATENATED MODULE: ../../schemas/fields.ts

const permissionFields = {
    canManageProducts: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can Update and delete any product'
    }),
    canSeeOtherUsers: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can query other users'
    }),
    canManageUsers: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can Edit other users'
    }),
    canManageRoles: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can CRUD roles'
    }),
    canManageCart: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can see and manage cart and cart items'
    }),
    canManageOrders: (0,fields_namespaceObject.checkbox)({
        defaultValue: false,
        label: 'User can see and manage orders'
    })
};
const permissionsList = Object.keys(permissionFields);

;// CONCATENATED MODULE: ../../access.ts

// At it's simplest, the access control returns a yes or no value depending on the users session
function isSignedIn({ session  }) {
    return !!session;
}
const generatedPermissions = Object.fromEntries(permissionsList.map((permission)=>{
    return [
        permission,
        function({ session  }) {
            var ref;
            return !!((ref = session === null || session === void 0 ? void 0 : session.data.role) === null || ref === void 0 ? void 0 : ref[permission]);
        }, 
    ];
}));
// Permissions check if someone meets a criteria - yes or no.
const permissions = {
    ...generatedPermissions,
    isAwesome ({ session  }) {
        return !!(session === null || session === void 0 ? void 0 : session.data.name.includes('wes'));
    }
};
// Rule based function
// Rules can return a boolean - yes or no - or a filter which limits which products they can CRUD.
const rules = {
    canManageProducts ({ session  }) {
        if (!isSignedIn({
            session
        })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageProducts({
            session
        })) {
            return true;
        }
        // 2. If not, do they own this item?
        return {
            user: {
                id: {
                    equals: session === null || session === void 0 ? void 0 : session.itemId
                }
            }
        };
    },
    canOrder ({ session  }) {
        if (!isSignedIn({
            session
        })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({
            session
        })) {
            return true;
        }
        // 2. If not, do they own this item?
        return {
            user: {
                id: {
                    equals: session === null || session === void 0 ? void 0 : session.itemId
                }
            }
        };
    },
    canManageOrderItems ({ session  }) {
        if (!isSignedIn({
            session
        })) {
            return false;
        }
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({
            session
        })) {
            return true;
        }
        // 2. If not, do they own this item?
        return {
            order: {
                user: {
                    id: {
                        equals: session === null || session === void 0 ? void 0 : session.itemId
                    }
                }
            }
        };
    },
    canReadProducts ({ session  }) {
        if (!isSignedIn({
            session
        })) {
            return false;
        }
        if (permissions.canManageProducts({
            session
        })) {
            return true; // They can read everything!
        }
        // They should only see available products (based on the status field)
        return {
            status: {
                equals: 'AVAILABLE'
            }
        };
    },
    canManageUsers ({ session  }) {
        if (!isSignedIn({
            session
        })) {
            return false;
        }
        if (permissions.canManageUsers({
            session
        })) {
            return true;
        }
        // Otherwise they may only update themselves!
        return {
            id: {
                equals: session === null || session === void 0 ? void 0 : session.itemId
            }
        };
    }
};

;// CONCATENATED MODULE: ../../schemas/Role.ts




const Role = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: permissions.canManageRoles,
            query: permissions.canManageRoles,
            update: permissions.canManageRoles,
            delete: permissions.canManageRoles
        }
    },
    ui: {
        hideCreate: (args)=>!permissions.canManageRoles(args)
        ,
        hideDelete: (args)=>!permissions.canManageRoles(args)
        ,
        isHidden: (args)=>!permissions.canManageRoles(args)
    },
    fields: {
        name: (0,fields_namespaceObject.text)({
            validation: {
                isRequired: true
            }
        }),
        ...permissionFields,
        assignedTo: (0,fields_namespaceObject.relationship)({
            ref: 'User.role',
            many: true,
            ui: {
                itemView: {
                    fieldMode: 'read'
                }
            }
        })
    }
});

;// CONCATENATED MODULE: ../../schemas/OrderItem.ts



const OrderItem = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: isSignedIn,
            update: ()=>false
            ,
            delete: ()=>false
        },
        filter: {
            query: rules.canManageOrderItems
        }
    },
    fields: {
        name: (0,fields_namespaceObject.text)({
            validation: {
                isRequired: true
            }
        }),
        description: (0,fields_namespaceObject.text)({
            ui: {
                displayMode: 'textarea'
            }
        }),
        photo: (0,fields_namespaceObject.relationship)({
            ref: 'ProductImage',
            ui: {
                displayMode: 'cards',
                cardFields: [
                    'image',
                    'altText'
                ],
                inlineCreate: {
                    fields: [
                        'image',
                        'altText'
                    ]
                },
                inlineEdit: {
                    fields: [
                        'image',
                        'altText'
                    ]
                }
            }
        }),
        price: (0,fields_namespaceObject.integer)(),
        quantity: (0,fields_namespaceObject.integer)(),
        order: (0,fields_namespaceObject.relationship)({
            ref: 'Order.items'
        })
    }
});

;// CONCATENATED MODULE: ../../lib/formatMoney.ts
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
function formatMoney(cents) {
    const dollars = cents / 100;
    return formatter.format(dollars);
};

;// CONCATENATED MODULE: ../../schemas/Order.ts




const Order = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: isSignedIn,
            update: ()=>false
            ,
            delete: ()=>false
        },
        filter: {
            query: rules.canOrder
        }
    },
    fields: {
        label: (0,fields_namespaceObject.virtual)({
            field: core_namespaceObject.graphql.field({
                type: core_namespaceObject.graphql.String,
                resolve (item) {
                    return `${formatMoney(item.total)}`;
                }
            })
        }),
        total: (0,fields_namespaceObject.integer)(),
        items: (0,fields_namespaceObject.relationship)({
            ref: 'OrderItem.order',
            many: true
        }),
        user: (0,fields_namespaceObject.relationship)({
            ref: 'User.orders'
        }),
        charge: (0,fields_namespaceObject.text)()
    }
});

;// CONCATENATED MODULE: ../../schemas/CartItem.ts



const CartItem = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: isSignedIn
        },
        filter: {
            query: rules.canOrder,
            update: rules.canOrder,
            delete: rules.canOrder
        }
    },
    ui: {
        listView: {
            initialColumns: [
                'product',
                'quantity',
                'user'
            ]
        }
    },
    fields: {
        // TODO: Custom Label in here
        quantity: (0,fields_namespaceObject.integer)({
            defaultValue: 1,
            validation: {
                isRequired: true
            }
        }),
        product: (0,fields_namespaceObject.relationship)({
            ref: 'Product'
        }),
        user: (0,fields_namespaceObject.relationship)({
            ref: 'User.cart'
        })
    }
});

;// CONCATENATED MODULE: external "dotenv/config"
const config_namespaceObject = require("dotenv/config");
;// CONCATENATED MODULE: external "@keystone-6/cloudinary"
const cloudinary_namespaceObject = require("@keystone-6/cloudinary");
;// CONCATENATED MODULE: ../../schemas/ProductImage.ts





const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'fake',
    apiKey: process.env.CLOUDINARY_KEY || 'fake',
    apiSecret: process.env.CLOUDINARY_SECRET || 'fake',
    folder: 'sickfits'
};
const ProductImage = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: isSignedIn,
            query: ()=>true
            ,
            update: permissions.canManageProducts,
            delete: permissions.canManageProducts
        }
    },
    fields: {
        image: (0,cloudinary_namespaceObject.cloudinaryImage)({
            cloudinary,
            label: 'Source'
        }),
        altText: (0,fields_namespaceObject.text)(),
        product: (0,fields_namespaceObject.relationship)({
            ref: 'Product.photo'
        })
    },
    ui: {
        listView: {
            initialColumns: [
                'image',
                'altText',
                'product'
            ]
        }
    }
});

;// CONCATENATED MODULE: ../../schemas/Product.ts



const Product = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: isSignedIn
        },
        filter: {
            query: rules.canReadProducts,
            update: rules.canManageProducts,
            delete: rules.canManageProducts
        }
    },
    fields: {
        name: (0,fields_namespaceObject.text)({
            validation: {
                isRequired: true
            }
        }),
        description: (0,fields_namespaceObject.text)({
            ui: {
                displayMode: 'textarea'
            }
        }),
        photo: (0,fields_namespaceObject.relationship)({
            ref: 'ProductImage.product',
            ui: {
                displayMode: 'cards',
                cardFields: [
                    'image',
                    'altText'
                ],
                inlineCreate: {
                    fields: [
                        'image',
                        'altText'
                    ]
                },
                inlineEdit: {
                    fields: [
                        'image',
                        'altText'
                    ]
                }
            }
        }),
        status: (0,fields_namespaceObject.select)({
            options: [
                {
                    label: 'Draft',
                    value: 'DRAFT'
                },
                {
                    label: 'Available',
                    value: 'AVAILABLE'
                },
                {
                    label: 'Unavailable',
                    value: 'UNAVAILABLE'
                }, 
            ],
            defaultValue: 'DRAFT',
            ui: {
                displayMode: 'segmented-control',
                createView: {
                    fieldMode: 'hidden'
                }
            }
        }),
        price: (0,fields_namespaceObject.integer)(),
        user: (0,fields_namespaceObject.relationship)({
            ref: 'User.products',
            hooks: {
                resolveInput ({ operation , resolvedData , context  }) {
                    var ref;
                    // Default to the currently logged in user on create.
                    if (operation === 'create' && !resolvedData.user && ((ref = context.session) === null || ref === void 0 ? void 0 : ref.itemId)) {
                        var ref1;
                        return {
                            connect: {
                                id: (ref1 = context.session) === null || ref1 === void 0 ? void 0 : ref1.itemId
                            }
                        };
                    }
                    return resolvedData.user;
                }
            }
        })
    }
});

;// CONCATENATED MODULE: ../../schemas/User.ts



const User = (0,core_namespaceObject.list)({
    access: {
        operation: {
            create: ()=>true
            ,
            // only people with the permission can delete themselves!
            // You can't delete yourself
            delete: permissions.canManageUsers
        },
        filter: {
            query: rules.canManageUsers,
            update: rules.canManageUsers
        }
    },
    ui: {
        // hide the backend UI from regular users
        hideCreate: (args)=>!permissions.canManageUsers(args)
        ,
        hideDelete: (args)=>!permissions.canManageUsers(args)
    },
    fields: {
        name: (0,fields_namespaceObject.text)({
            validation: {
                isRequired: true
            }
        }),
        email: (0,fields_namespaceObject.text)({
            isIndexed: 'unique',
            validation: {
                isRequired: true
            }
        }),
        password: (0,fields_namespaceObject.password)(),
        cart: (0,fields_namespaceObject.relationship)({
            ref: 'CartItem.user',
            many: true,
            ui: {
                createView: {
                    fieldMode: 'hidden'
                },
                itemView: {
                    fieldMode: 'read'
                }
            }
        }),
        orders: (0,fields_namespaceObject.relationship)({
            ref: 'Order.user',
            many: true
        }),
        role: (0,fields_namespaceObject.relationship)({
            ref: 'Role.assignedTo',
            access: {
                create: permissions.canManageUsers,
                update: permissions.canManageUsers
            }
        }),
        products: (0,fields_namespaceObject.relationship)({
            ref: 'Product.user',
            many: true
        })
    }
});

;// CONCATENATED MODULE: ../../seed-data/data.ts
function timestamp() {
    // sometime in the last 30 days
    const stampy = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30);
    return new Date(stampy).toISOString();
}
const products = [
    {
        name: 'Yeti Hondo',
        description: 'soo nice',
        status: 'AVAILABLE',
        price: 3423,
        photo: {
            id: '5dfbed262849d7961377c2c0',
            filename: 'hondo.jpg',
            originalFilename: 'hondo.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5dfbed262849d7961377c2c0',
                version: 1576791335,
                signature: '9f7d5115788b7677307a39214f9684dd827ea5f9',
                width: 750,
                height: 457,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 27871,
                type: 'upload',
                etag: 'e1fdf84d5126b6ca2e1c8ef9532be5a5',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1576791335/sick-fits-keystone/5dfbed262849d7961377c2c0.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Airmax 270',
        description: 'Great shoes!',
        status: 'AVAILABLE',
        price: 5234,
        photo: {
            id: '5e2a13f0689b2835ae71d1a5',
            filename: '270-camo-sunset.jpg',
            originalFilename: '270-camo-sunset.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a13f0689b2835ae71d1a5',
                version: 1579815920,
                signature: 'a430b2d35f6a03dc562f6f56a474deb6810e393f',
                width: 960,
                height: 640,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 45455,
                type: 'upload',
                etag: 'aebe8e9cc98ee4ad71682f19af85745b',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579815920/sick-fits-keystone/5e2a13f0689b2835ae71d1a5.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'KITH Hoodie',
        description: 'Love this hoodie',
        status: 'AVAILABLE',
        price: 23562,
        photo: {
            id: '5e2a13ff689b2835ae71d1a7',
            filename: 'kith-hoodie.jpg',
            originalFilename: 'kith-hoodie.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a13ff689b2835ae71d1a7',
                version: 1579815935,
                signature: '360df116020320a14845cf235b87a4a5cdc23f86',
                width: 2000,
                height: 2000,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 202924,
                type: 'upload',
                etag: 'b6fbc18b196c68e2b87f51539b849e70',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579815935/sick-fits-keystone/5e2a13ff689b2835ae71d1a7.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Fanorak',
        description: 'Super hip. Comes in a number of colours',
        status: 'AVAILABLE',
        price: 252342,
        photo: {
            id: '5e2a1413689b2835ae71d1a9',
            filename: 'TNF-fanorak.png',
            originalFilename: 'TNF-fanorak.png',
            mimetype: 'image/png',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a1413689b2835ae71d1a9',
                version: 1579815957,
                signature: 'affd16fa20107a4d5399aab553ea77fff1c4b2ef',
                width: 1276,
                height: 1490,
                format: 'png',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 2454948,
                type: 'upload',
                etag: 'ce0f36da93c60c5d4406657225206f70',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579815957/sick-fits-keystone/5e2a1413689b2835ae71d1a9.png',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Nike Vapormax',
        description: 'Kind of squeaky on some floors',
        status: 'AVAILABLE',
        price: 83456,
        photo: {
            id: '5e2a142c689b2835ae71d1ab',
            filename: 'vapormax.jpg',
            originalFilename: 'vapormax.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a142c689b2835ae71d1ab',
                version: 1579815980,
                signature: '6dd95447407c06ba955164c4961bd4abc2fb9f4d',
                width: 1100,
                height: 735,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 183071,
                type: 'upload',
                etag: '5550566c7fab113ba32d85ed08f54faa',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579815980/sick-fits-keystone/5e2a142c689b2835ae71d1ab.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Yeti Cooler',
        description: 'Who spends this much on a cooler?!',
        status: 'AVAILABLE',
        price: 75654,
        photo: {
            id: '5e2a143f689b2835ae71d1ad',
            filename: 'coral-yeti.jpg',
            originalFilename: 'coral-yeti.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a143f689b2835ae71d1ad',
                version: 1579815999,
                signature: '97e8f27cdbb6a736062391b9ac3a5c689bd50646',
                width: 1300,
                height: 1144,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 286643,
                type: 'upload',
                etag: '3655bfd83998492b8421782db868c9df',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579815999/sick-fits-keystone/5e2a143f689b2835ae71d1ad.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Naked and Famous Denim',
        description: 'Japanese Denim, made in Canada',
        status: 'AVAILABLE',
        price: 10924,
        photo: {
            id: '5e2a145d689b2835ae71d1af',
            filename: 'naked-and-famous-denim.jpg',
            originalFilename: 'naked-and-famous-denim.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a145d689b2835ae71d1af',
                version: 1579816030,
                signature: '76dec3670cc4a4c22723720bb94496a35945c626',
                width: 1024,
                height: 683,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 146817,
                type: 'upload',
                etag: '3d68591332785ae5273ed43b1aa91712',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816030/sick-fits-keystone/5e2a145d689b2835ae71d1af.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Rimowa Luggage',
        description: 'S T E A L T H',
        status: 'AVAILABLE',
        price: 47734,
        photo: {
            id: '5e2a147b689b2835ae71d1b1',
            filename: 'rimowa.png',
            originalFilename: 'rimowa.png',
            mimetype: 'image/png',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a147b689b2835ae71d1b1',
                version: 1579816060,
                signature: 'a6161568d2d59a59e8dba9b15e705581198ea377',
                width: 800,
                height: 1004,
                format: 'png',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 953657,
                type: 'upload',
                etag: 'd89ab8ecc366bc63464a3eeef6ef3010',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816060/sick-fits-keystone/5e2a147b689b2835ae71d1b1.png',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Black Hole ',
        description: 'Outdoorsy ',
        status: 'AVAILABLE',
        price: 4534,
        photo: {
            id: '5e2a149b689b2835ae71d1b3',
            filename: 'patagonia black hole.jpg',
            originalFilename: 'patagonia black hole.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a149b689b2835ae71d1b3',
                version: 1579816093,
                signature: '6ac148051cb4ba0227ee49fd61fa1348ab4a9870',
                width: 2000,
                height: 2000,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 515360,
                type: 'upload',
                etag: '8aed0984d37a3d12faa832860b29d24b',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816093/sick-fits-keystone/5e2a149b689b2835ae71d1b3.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Nudie Belt',
        description: 'Sick design',
        status: 'AVAILABLE',
        price: 5234,
        photo: {
            id: '5e2a14b1689b2835ae71d1b5',
            filename: 'nudie-belt.jpg',
            originalFilename: 'nudie-belt.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a14b1689b2835ae71d1b5',
                version: 1579816114,
                signature: '24f3ff4ae91dfcc8d1ddeb1a713215730e834be4',
                width: 650,
                height: 650,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 71291,
                type: 'upload',
                etag: '3a4b97ef88c550dcd6c2d399d1bc698e',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816114/sick-fits-keystone/5e2a14b1689b2835ae71d1b5.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Goose',
        description: 'Keep warm.',
        status: 'AVAILABLE',
        price: 74544,
        photo: {
            id: '5e2a14bf689b2835ae71d1b7',
            filename: 'canada-goose.jpg',
            originalFilename: 'canada-goose.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a14bf689b2835ae71d1b7',
                version: 1579816128,
                signature: 'bebf3d817e91cdbb91768e8c9c2133a78798a317',
                width: 800,
                height: 800,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 180261,
                type: 'upload',
                etag: 'f9c8725f815a6873cbdc47ba3f869049',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816128/sick-fits-keystone/5e2a14bf689b2835ae71d1b7.jpg',
                original_filename: 'file'
            }
        }
    },
    {
        name: 'Ultraboost',
        description: 'blacked out',
        status: 'AVAILABLE',
        price: 6344,
        photo: {
            id: '5e2a14cc689b2835ae71d1b9',
            filename: 'ultra-boost.jpg',
            originalFilename: 'ultra-boost.jpg',
            mimetype: 'image/jpeg',
            encoding: '7bit',
            _meta: {
                public_id: 'sick-fits-keystone/5e2a14cc689b2835ae71d1b9',
                version: 1579816141,
                signature: '18720c13b7f6d4fcde919dddb33d1c711a459c14',
                width: 565,
                height: 372,
                format: 'jpg',
                resource_type: 'image',
                created_at: timestamp(),
                tags: [],
                bytes: 50754,
                type: 'upload',
                etag: '44cf57f8218f135b82cfa5df0da92a49',
                placeholder: false,
                url: 'http://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg',
                secure_url: 'https://res.cloudinary.com/wesbos/image/upload/v1579816141/sick-fits-keystone/5e2a14cc689b2835ae71d1b9.jpg',
                original_filename: 'file'
            }
        }
    }, 
];

;// CONCATENATED MODULE: ../../seed-data/index.ts

async function insertSeedData({ prisma  }) {
    console.log(`🌱 Inserting Seed Data: ${products.length} Products`);
    for (const product of products){
        console.log(`  🛍️ Adding Product: ${product.name}`);
        const { id  } = await prisma.productImage.create({
            data: {
                image: JSON.stringify(product.photo),
                altText: product.description
            }
        });
        // @ts-ignore
        delete product.photo;
        // @ts-ignore
        product.photoId = id;
        await prisma.product.create({
            data: product
        });
    }
    console.log(`✅ Seed Data Inserted: ${products.length} Products`);
    console.log(`👋 Please start the process with \`yarn dev\` or \`npm run dev\``);
    process.exit();
}

;// CONCATENATED MODULE: external "nodemailer"
const external_nodemailer_namespaceObject = require("nodemailer");
;// CONCATENATED MODULE: ../../lib/mail.ts

const transport = (0,external_nodemailer_namespaceObject.createTransport)({
    // @ts-ignore
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});
function makeANiceEmail(text) {
    return `
    <div className="email" style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</p>

      <p>😘, Wes Bos</p>
    </div>
  `;
}
async function sendPasswordResetEmail(resetToken, to) {
    var ref;
    // email the user a token
    const info = await transport.sendMail({
        to,
        from: 'wes@wesbos.com',
        subject: 'Your password reset token!',
        html: makeANiceEmail(`Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to reset</a>
    `)
    });
    if ((ref = process.env.MAIL_USER) === null || ref === void 0 ? void 0 : ref.includes('ethereal.email')) {
        console.log(`� Message Sent!  Preview it at ${(0,external_nodemailer_namespaceObject.getTestMessageUrl)(info)}`);
    }
}

;// CONCATENATED MODULE: ../../mutations/addToCart.ts
async function addToCart(root, { productId  }, context) {
    console.log('ADDING TO CART!');
    // 1. Query the current user see if they are signed in
    const sesh = context.session;
    if (!sesh.itemId) {
        throw new Error('You must be logged in to do this!');
    }
    // 2. Query the current users cart
    const allCartItems = await context.query.CartItem.findMany({
        where: {
            user: {
                id: {
                    equals: sesh.itemId
                }
            },
            product: {
                id: {
                    equals: productId
                }
            }
        },
        query: 'id quantity'
    });
    const [existingCartItem] = allCartItems;
    if (existingCartItem) {
        console.log(existingCartItem);
        console.log(`There are already ${existingCartItem.quantity}, increment by 1!`);
        // 3. See if the current item is in their cart
        // 4. if itis, increment by 1
        return await context.db.CartItem.updateOne({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + 1
            }
        });
    }
    // 4. if it isnt, create a new cart item!
    return await context.db.CartItem.createOne({
        data: {
            product: {
                connect: {
                    id: productId
                }
            },
            user: {
                connect: {
                    id: sesh.itemId
                }
            }
        }
    });
}
/* harmony default export */ const mutations_addToCart = (addToCart);

;// CONCATENATED MODULE: ../../mutations/checkout.ts
// import stripeConfig from '../lib/stripe';
const graphql = String.raw;
async function checkout(root, { token  }, context) {
    // 1. Make sure they are signed in
    const userId = context.session.itemId;
    if (!userId) {
        throw new Error('Sorry! You must be signed in to create an order!');
    }
    // 1.5 Query the current user
    const user = await context.query.User.findOne({
        where: {
            id: userId
        },
        query: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
    });
    console.dir(user, {
        depth: null
    });
    // 2. calc the total price for their order
    const cartItems = user.cart.filter((cartItem)=>cartItem.product
    );
    const amount = cartItems.reduce(function(tally, cartItem) {
        return tally + cartItem.quantity * cartItem.product.price;
    }, 0);
    console.log(amount);
    // 3. create the charge with the stripe library
    // const charge = await stripeConfig.paymentIntents
    //   .create({
    //     amount,
    //     currency: 'USD',
    //     confirm: true,
    //     payment_method: token,
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     throw new Error(err.message);
    //   });
    console.log({
        token
    }); // Use the "unused" variable
    const charge = {
        amount,
        id: 'MADE UP'
    };
    console.log(charge);
    // 4. Convert the cartItems to OrderItems
    const orderItems = cartItems.map((cartItem)=>{
        const orderItem = {
            name: cartItem.product.name,
            description: cartItem.product.description,
            price: cartItem.product.price,
            quantity: cartItem.quantity,
            photo: {
                connect: {
                    id: cartItem.product.photo.id
                }
            }
        };
        return orderItem;
    });
    console.log('gonna create the order');
    // 5. Create the order and return it
    const order = await context.db.Order.createOne({
        data: {
            total: charge.amount,
            charge: charge.id,
            items: {
                create: orderItems
            },
            user: {
                connect: {
                    id: userId
                }
            }
        }
    });
    console.log({
        order
    });
    // 6. Clean up any old cart item
    const cartItemIds = user.cart.map((cartItem)=>cartItem.id
    );
    console.log('gonna create delete cartItems');
    await context.query.CartItem.deleteMany({
        where: cartItemIds.map((id)=>({
                id
            })
        )
    });
    return order;
}
/* harmony default export */ const mutations_checkout = (checkout);

;// CONCATENATED MODULE: ../../mutations/index.ts



// make a fake graphql tagged template literal
const mutations_graphql = String.raw;
const extendGraphqlSchema = (0,core_namespaceObject.graphQLSchemaExtension)({
    typeDefs: mutations_graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      checkout(token: String!): Order
    }
  `,
    resolvers: {
        Mutation: {
            addToCart: mutations_addToCart,
            checkout: mutations_checkout
        }
    }
});

;// CONCATENATED MODULE: ../../keystone.ts















const databaseURL = process.env.DATABASE_URL || 'file:./keystone.db';
const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360,
    secret: process.env.COOKIE_SECRET || 'this secret should only be used in testing'
};
const { withAuth  } = (0,auth_namespaceObject.createAuth)({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        // These fields are collected in the "Create First User" form
        fields: [
            'name',
            'email',
            'password'
        ]
    },
    passwordResetLink: {
        async sendToken (args) {
            // send the email
            await sendPasswordResetEmail(args.token, args.identity);
        }
    },
    sessionData: `id name email role { ${permissionsList.join(' ')} }`
});
/* harmony default export */ const keystone = (withAuth((0,core_namespaceObject.config)({
    server: {
        cors: {
            origin: [
                process.env.FRONTEND_URL
            ],
            credentials: true
        }
    },
    db: {
        provider: 'postgresql',
        url: databaseURL,
        async onConnect (context) {
            console.log('Connected to the database!');
            if (process.argv.includes('--seed-data')) {
                await insertSeedData(context);
            }
        }
    },
    lists: {
        // Schema items go in here
        User: User,
        Product: Product,
        ProductImage: ProductImage,
        CartItem: CartItem,
        OrderItem: OrderItem,
        Order: Order,
        Role: Role
    },
    extendGraphqlSchema: extendGraphqlSchema,
    ui: {
        // Show the UI only for poeple who pass this test
        isAccessAllowed: ({ session  })=>!!session
    },
    session: (0,session_namespaceObject.statelessSessions)(sessionConfig)
})));

;// CONCATENATED MODULE: ./pages/api/__keystone_api_build.js

/* harmony default export */ function _keystone_api_build(req, res) {
    return res.status(500);
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(8805));
module.exports = __webpack_exports__;

})();