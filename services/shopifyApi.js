import axios from "axios";


export class ShopifyApi{
    constructor(){
        this.accessToken = process.env.SHOPIFY_ACCESS_KEY
        this.shop = process.env.SHOP
        this.apiVersion = process.env.API_VERSION
        this.baseUrl = `https://${this.shop}/admin/api/${this.apiVersion}`
        this.headers = {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": this.accessToken,
        }
    }

    async graphql(query, variables=null){
        try{
            
            this.data = {query}
            if(variables){
                this.data['variables']=variables
            }
            const response = await axios.post(`${this.baseUrl}/graphql.json`, this.data, {
                headers: this.headers,
              });
            return response.data
        }catch(error){
            throw error
        }
    }
}