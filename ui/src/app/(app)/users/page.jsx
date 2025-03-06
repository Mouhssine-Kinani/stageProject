"use client"
import Table from '@/components/table/table'
import axios from 'axios'

async function handleSubmit(){
    try{
        const resp = await axios.get(`${process.env.NEXT_PUBLIC_URLAPI}/users/`)
        return resp.data
    }catch{
        console.log('error no usersss')
    }
}

const headers = [ 'Reference', 'Name', 'Role','Email', 'Last login', 'CreatedAt',  'Status']
const title = 'List of users'

export default function page() { 
    return (
        <div>
            <h2>{title}</h2><br />
            <Table handleSubmit={handleSubmit}
            headers={headers}
            />
        </div>
    );
}

    // const handleSubmits = async (form, setErrors)=>{
    //     try{
    //         await loginSchema.validate(form, { abortEarly: false }); 
    //         setErrors({});
    //         const response = axios.post(`${process.env.NEXT_PUBLIC_URLAPI}/auth/signin`, form)
    //         console.log(response)
    //     }
    //     catch (err) {
    //         const newErrors = {};
    //         err.inner.forEach((error) => {
    //             // by field name
    //             if(!error.path){
    //                 newErrors[formType] = error.message;
    //             }
    //             else{
    //                 newErrors[error.path] = error.message;
    //             }
    //         });
    //         setErrors(newErrors);
    //     }
    // }