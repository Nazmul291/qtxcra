import {BindMethods} from "../utility/bindMethods.js"
import {customerList, customerByEmail} from "../graphql/query.customer.js"
import {createCustomer, customerSendAccountInviteEmail, updateCustomer} from "../graphql/mutation.customer.js"
import {ShopifyApi} from "../services/shopifyApi.js"

class ShopifyCustomerController {
    constructor(){
      this.statusCode = 500;
      this.message = 'Internal Server Error';
    }

    async getCustomerIdByEmail(req, res, next){
        const shopifyApi= new ShopifyApi()
        const email = req.query.email
        try{
            const response = await shopifyApi.graphql(customerByEmail, {email:`email:${email}`})
            console.log(response.data.customers?.nodes[0])
            const customer = response.data.customers?.nodes[0]
            if(res){
                return res.status(200).send({id:customer?.id, isMember:customer?.metafield?.value})
            }
            return {id:customer?.id, isMember:customer?.metafield?.value}
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
            firstName,
            lastName,
            email,
            company,
            companyRegion,
            phone,
            vat,
            billingAddress,
            shippingAddress,
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

        if(billingAddress){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"billingAddress",
                value:billingAddress
            })
        }

        if(shippingAddress){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"shippingAddress",
                value:shippingAddress
            })
        }

        if(vat){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"vat",
                value:vat
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

        if(phone){
            customerMetafields.push({
                namespace:"member",
                type:"single_line_text_field",
                key:"phone",
                value:phone
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

        if(firstName){
            customerInput["firstName"]=firstName
        }
        if(lastName){
            customerInput["lastName"]=lastName
        }
        if(email){
            customerInput["email"]=email
        }
        
        try{
            if(customerMetafields.length>0){
                customerInput["metafields"]=customerMetafields
            }
            const variables={
                input: {}
            }
            let {id:customerId, isMember}=await this.getCustomerIdByEmail({query:{email}})
            if(isMember=="true"){
                return res.status(200).send({success:false, message:`You are already member please login with this ${customerInput["email"]} email to acess your account!`})
            }
            if(customerId){
                variables['input']['id']=customerId
                delete variables['input']['firstName']
                delete variables['input']['lastName']
                delete variables['input']['email']
                await shopifyApi.graphql(updateCustomer, variables)

                return res.status(200).send({success:true, message:"Customer update success"})
            }else{
                const response = await shopifyApi.graphql(createCustomer, variables)
                // console.log(response)
                customerId=response.data?.customerCreate?.customer?.id
                
            }
            if(customerId){
                const activation = await shopifyApi.graphql(customerSendAccountInviteEmail,{customerId})
                console.log(activation)
            }
            
            
            return res.status(200).send({success:true, message:"Please check your email—we’ve sent you an invitation. Let us know if you have any questions or need assistance. We're here to help!"})
        }catch(error){
            console.log(error)
            res.status(404).send({message:"Something went wrong"})
        }
    }
  
  }
  
  const binding = new BindMethods(new ShopifyCustomerController())
  export default binding.bindMethods();

  