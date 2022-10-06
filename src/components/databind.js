export default databind = (element, datacontext) => {
    let created = document.createElement(element);
    for (const key in datacontext) {
        if (Object.hasOwnProperty.call(datacontext, key)) {
            created.setAttribute(`data-${key}`,  datacontext[key]);
        }
    }
    return created;
}