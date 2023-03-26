
class ApiFeature {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            },
        } : {};

        console.log(keyword);

        this.query = this.query.find({ ...keyword });
        return this
    }

    filter() {
        const querCopy = { ...this.queryStr };

        //Removing some field for category

        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach((key) => delete querCopy[key]);

        //Filter some proce and rating
        console.log(querCopy);

        let queryStr = JSON.stringify(querCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        console.log(queryStr);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;

    }

    pagination() {

        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }

}

export default ApiFeature;