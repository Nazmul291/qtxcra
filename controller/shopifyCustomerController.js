import {BindMethods} from "../utility/bindMethods.js"
import {customerList, customerByEmail} from "../graphql/query.customer.js"
import {createCustomer, customerSendAccountInviteEmail, updateCustomer} from "../graphql/mutation.customer.js"
import {ShopifyApi} from "../services/shopifyApi.js"

class ShopifyCustomerController {
    constructor(){
      this.statusCode = 500;
      this.message = 'Internal Server Error';
    }

    async getCustomerIdByEmail(email){
        const shopifyApi= new ShopifyApi()
        try{
            const response = await shopifyApi.graphql(customerByEmail, {email:`email:${email}`})
            const id = response.data.customers?.nodes[0]?.id
            return id
        }catch(error){
            console.log(error)
            return null
        }
    }

    async getCustomers(req, res, next){
        const shopifyApi= new ShopifyApi()
        try{
            const response = await shopifyApi.graphql(customerList)
            console.log(response.data.customers)
            res.status(200).send({success:true})
        }catch(error){
            console.log(error)
            res.status(404).send({message:"Something went wrong"})
        }
    }



    async createCustomers(req, res, next){
        const shopifyApi= new ShopifyApi()
        const {
            name,
            email,
            company,
            companyRegion,
            phone,
            annualRevenue,
            totalCustomers,
            monthlyPurchasePlan,
            tellUs,
            brands,
            aboutCompany,
            password,
            passwordConfirm
        }=req.body
        const customerInput={

        }
        const customerMetafields=[{
            namespace:"member",
            type:"boolean",
            key:"isMember",
            value:"true"
        }]
        if(company){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"company",
                value:company
            })
        }

        if(companyRegion){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"companyRegion",
                value:companyRegion
            })
        }

        if(annualRevenue){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"annualRevenue",
                value:annualRevenue
            })
        }

        if(totalCustomers){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"totalCustomers",
                value:totalCustomers
            })
        }

        if(monthlyPurchasePlan){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"monthlyPurchasePlan",
                value:monthlyPurchasePlan
            })
        }

        if(tellUs){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"tellUs",
                value:tellUs
            })
        }

        if(brands){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"brands",
                value:brands
            })
        }

        if(aboutCompany){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"aboutCompany",
                value:aboutCompany
            })
        }

        if(password){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"password",
                value:password
            })
        }

        if(passwordConfirm){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"passwordConfirm",
                value:passwordConfirm
            })
        }

        if(name){
            const names = name.split(" ");
            customerInput["firstName"]=names[0]
            if(names.length>0){
                customerInput["lastName"]=names[1]
            }
        }
        if(email){
            customerInput["email"]=email
        }
        if(phone){
            customerInput["phone"]=phone
        }
        try{
            if(customerMetafields.length>0){
                customerInput["metafields"]=customerMetafields
            }
            const variables={
                input: customerInput
            }
            let customerId=await this.getCustomerIdByEmail(email)
            console.log(customerId)
            if(customerId){
                variables['input']['id']=customerId
                delete variables['input']['firstName']
                delete variables['input']['lastName']
                delete variables['input']['email']
                delete variables['input']['phone']
                await shopifyApi.graphql(updateCustomer, variables)
            }else{
                const response = await shopifyApi.graphql(createCustomer, variables)
                // console.log(response)
                customerId=response.data?.customerCreate?.customer?.id
                const activation = await shopifyApi.graphql(customerSendAccountInviteEmail,{customerId})
                console.log(activation)

            }
            
            
            return res.status(200).send({success:true})
        }catch(error){
            console.log(error)
            res.status(404).send({message:"Something went wrong"})
        }
    }
  
  }
  
  const binding = new BindMethods(new ShopifyCustomerController())
  export default binding.bindMethods();

  