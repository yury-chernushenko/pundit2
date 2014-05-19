// TODO: docs!
angular.module('Pundit2.Core')
/**
 *
 * @ngdoc object
 * @name Configuration
 *
 * @module Pundit2.Core
 *
 * @description
 * This is the object configuration in which is possible to set
 * values of its properties.
 *
 * Each properties has a default value.
 */
    .constant('PUNDITDEFAULTCONF', {
    annotationServerBaseURL: 'http://demo-cloud.as.thepund.it:8080/annotationserver/',
    debugAllModules: false,
    vocabularies: [],
    useBasicRelations: true,


    // Modules active by default are activated here with active=true
        /**
         *
         * @ngdoc property
         * @name Configuration#modules
         *
         * @module Pundit2.Core
         *
         * @description
         * This is the list of modules requires in Pundit 2 and its own configuration.
         * Each module has a configuration object describe below.
         *
         * Example
         *
         * <pre>
         *     modules: {
         *         'Toolbar': {
         *             askLinkDefault: "http://ask.thepund.it/",
         *             debug: false
         *         },
         *         'Preview': {
         *             welcomeHeaderMessage: "Welcome in Pundit 2",
         *             welcomeBodyMessage: "Enjoy it"
         *         }
         *     }
         *
         * </pre>
         */
    modules: {

        // Modules which requires to be bootstrapped (add stuff to Pundit2's root node or
        // to some Dashboard panel) by the client are listed as .bootModules inside the
        // modules.Client conf object. See CLIENTDEFAULTS
        Client: {
            // Client by default MUST NOT BE ACTIVE, or components will not be usable
            // individually: the client will bootstrap itself in its run() and screw
            // things up .. :|
            active: false
        },

        Dashboard: {
            active: true
        },
        Toolbar: {
            active: true
        },
        AnnotationSidebar: {
            active: true
        },
        Preview: {
            active: true
        },
        PageItemsContainer: {
            active: true
        },
        MyItemsContainer: {
            active: true
        },

        selectors: {
            'Freebase': {
                label: 'Freebase', active: true
            },
            'DBPedia': {
                label: 'DBPedia', active: false
            }
        },
        
        'pundit.AnalyticsHelper': {
            active: true
        },
        'pundit.XpointersHelper': {
            // Node name and class used to wrap our annotated content
            wrapNodeName: 'span',
            wrapNodeClass: 'cons',

            // Class used on a container to indicate it's a named content: xpointers
            // will start from that node
            contentClasses: ['pundit-content'],

            // Nodes with these classes will be ignored when building xpointers
            // and consolidating annotations
            ignoreClasses: ['cons', 'pundit-icon-annotation']
        }
    }
    
});