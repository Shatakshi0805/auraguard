class APIFeatures {
    constructor(query, queryString) {
        this.query = query // MongoDB query (like Report.find())
        this.queryString = queryString // URL params like ?search=delhi 
    }

    search() {
        // check if URL has search param
        if (this.queryString.search) {
            const keyword = this.queryString.search.toLowerCase();// make lowercase for comparison

            // modify the MongoDB query to include $where filter
            // note: this is a basic string comparison 
            this.query = this.query.find({
                $or: [
                    { location: { $regex: this.queryString.search, $options: 'i' } },
                    { typeOfIncident: { $regex: this.queryString.search, $options: 'i' } },
                    { description: { $regex: this.queryString.search, $options: 'i' } },
                    { landmarks: { $regex: this.queryString.search, $options: 'i' } },
                    { attackerGender: { $regex: this.queryString.search, $options: 'i' } }
                ]
            });
        }
        return this
    }

    sort() {
        if (this.queryString.sort) {
            // ?sort=timestamp or ?sort=-timestamp
            this.query = this.query.sort(this.queryString.sort)
        } else {
            // default sort by latest
            this.query = this.query.sort("-timeStamp")
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 20  // Changed from 20 to ensure it gets the right limit
        const skip = (page - 1) * limit

        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures