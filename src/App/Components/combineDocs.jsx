// const combineDocs = (docs) => {
//     return docs.map((doc) => doc.pageContent).join('\n\n');
// };

// export default combineDocs

const combineDocs = (docs) => {
    // Since the docs array already contains strings, we can directly join them.
    return docs.join('\n\n');
};

export default combineDocs;