const removeQueryParamsFromRouter = (router, removeList : any) => {
    if (removeList.length > 0) {
        removeList.forEach((param) => delete router.query[param]);
    } else {
        // Remove all
        Object.keys(router.query).forEach((param) => delete router.query[param]);
    }
    router.replace(
        {
            pathname: router.pathname,
            query: router.query
        },
        undefined,
        /**
         * Do not refresh the page
         */
        { shallow: true }
    );
};

export default removeQueryParamsFromRouter