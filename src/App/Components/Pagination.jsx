const Pagination = ({ paginated, setPageNo, pageNo }) => {
    const totalPages = paginated.length;

    const totalResults = () => {
        let results = 0;
        paginated.forEach(element => {
            results += element.length;
        });

        return results;
    }

    const renderPageNumbers = () => {
        let pageNumbers = [];

        if (pageNo === 0) {
            // First page
            for (let i = 0; i < Math.min(3, totalPages); i++) {
                pageNumbers.push(i);
            }
        } else if (pageNo === totalPages - 1) {
            // Last page
            for (let i = Math.max(0, totalPages - 3); i < totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Middle pages
            pageNumbers.push(pageNo - 1);
            pageNumbers.push(pageNo);
            pageNumbers.push(pageNo + 1);
        }

        return pageNumbers;
    };

    const pageNumbers = renderPageNumbers();

    return (
        <div className="row">
            <div className="col-md-6">
                Showing {paginated[pageNo] ? paginated[pageNo].length : 0} from {totalResults()}
            </div>
            <div className="col-md-6 text-end">
                <button onClick={() => setPageNo(0)} className="btn btn-sm btn-add-task ml-10">First</button>
                {pageNumbers.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => setPageNo(page)}
                        className={`btn btn-sm ${page === pageNo ? 'active-page' : 'default'} ml-10`}
                    >
                        {page + 1}
                    </button>
                ))}
                <button onClick={() => setPageNo(totalPages - 1)} className="btn btn-sm btn-add-task ml-10">Last</button>
            </div>
        </div>
    );
};

export default Pagination;
