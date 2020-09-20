import React, { Component } from "react";

class PropertyCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            records: []
        }
    }

    render(){
        const property = this.props.property
        return (
            <div className="card w-75">
                <p>{property.name}</p>
                <a href={`/owner-property-report?property=${property.mewsId}`}><button class="primary">View report</button></a>
                <a href={`/owner-property-stats?property=${property.mewsId}`}><button>View statistics</button></a>
            </div>
        );
    }
}


export default PropertyCard