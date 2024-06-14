import React,{useState, useEffect} from 'react'  
import {useForm} from "react-hook-form" 
import DataTable from 'react-data-table-component'
import {toast} from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {ThreeDots} from 'react-loader-spinner'   
import './App.css'
import {useAddMutation, useEditMutation, useDeleteMutation, useDeleteBulkMutation, useLazyParticularQuery, useLazyListQuery} from './redux/api/UserApi.js'
 
export default function App() {
    const [pageName] = useState([{
        title_1 : 'ADD USER',
        title_2 : 'DELETE SELECTED USER', 
    }])

    const [data,setData] = useState([]) 
    const [educationData,setEducationData] = useState([]) 
    const [dataID, setDataID] = useState(0) 
    const [className, setClassName] = useState('') 
    const [bulkRecordID,setBulkRecordID] = useState([])
    const [deleteDisabled,setDeleteDisabled] = useState(true)
    const [loaderVisible,setLoaderVisible] = useState(true)    
    //const [displaySectionModal,setDisplaySectionModal] = useState(false)  
    const [degree] = useState(['Associate','Bachelor','Master','Doctorate','Professional'])
    const [inputs, setInputs] = useState([1]);
    const [isRequired, setIsRequired] = useState(true);

    const {register, handleSubmit, formState: { errors }, setValue, reset} = useForm()
 
    const [addRecord] = useAddMutation() 
    const [editRecord] = useEditMutation()
    const [deleteRecord] = useDeleteMutation()
    const [deleteBulkRecord] = useDeleteBulkMutation()
    const [getAllRecord,{data:getAllValidationRecord}] = useLazyListQuery()
    const [getParticularRecord] = useLazyParticularQuery()
 
    const columns = [
        {
          name: '#',
          selector: (row,key) => key+1,
          width:'50px'
        },
        {
          name: 'Name',
          selector: row => `${row.first_name} ${row.last_name}`
        },
        {
            name: 'Email',
            selector: row => `${row.email}`,
        },
        {
            name: 'Phone',
            selector: row => `${row.phone}`,
        },
        {
            name: 'User Education',
            selector: row => <span onClick={()=>showEducationInfo(row.user_education)}>Click Here</span>,
        },
        {
            name: 'Action',
            selector: row => <>  
                <i className="fa fa-edit me-2" onClick={()=>{openEditModal(row._id)}} title="Edit record"></i> 
                <i className="fa fa-trash me-2" onClick={()=>{   
                    deleteData(row._id) 
                    setLoaderVisible(true)
                }} title="Delete record"></i>
            </>
        },
    ]
    const resetSubmit = () => {  
        reset() 
        setEducationData([])
        setInputs([1])
        setDataID(0) 
        document.getElementById('close-modal').click()
        setLoaderVisible(false)
    }
    const onSubmit = (data) => {  
        if(dataID === 0){
            addRecord(data).then((response)=>{
                if(response?.data?.status){  
                    toast.success(response.data.message) 
                }else{ 
                    toast.error(response.error.data.message) 
                }
            }).catch((err)=>{ 
                toast.error(`Error : ${err.message}`)
            })
            resetSubmit()
        }else{ 
            editRecord({dataID,...data}).then((response)=>{
                if(response?.data?.status){  
                    toast.success(response.data.message) 
                }else{ 
                    toast.error(response.error.data.message) 
                } 
            }).catch((err)=>{
                toast.error(`Error : ${err.message}`)
                setLoaderVisible(false)
            })
            resetSubmit()
        }
    }

    const showEducationInfo = (education_data)=>{
        document.getElementById('open-education-modal').click()
        setEducationData(education_data)
    }
    const openEditModal = async (record_id) => {   
        setDataID(record_id) 
        setIsRequired(false)
        document.getElementById('open-modal').click() 
        getParticularRecord(record_id).then((response)=>{  
            setValue("first_name", response.data.data.first_name)    
            setValue("last_name", response.data.data.last_name)  
            setValue("email", response.data.data.email)  
            setValue("address", response.data.data.address)  
            setValue("phone", response.data.data.phone)  
            setValue("dob", response.data.data.dob) 
            setEducationData(response.data.data.user_education) 
        }).catch((err)=>{
            toast.error(`Error : ${err.message}`)
            setLoaderVisible(false)
        })
    }

    const deleteData = async (record_id) => {
        let text = "Are you sure to delete this record?";
        if(window.confirm(text) === true) {
            deleteRecord(record_id).then((response)=>{
                if(response?.data?.status){  
                    toast.success(response.data.message)
                    setLoaderVisible(false)
                }else{ 
                    toast.error(response.error.data.message) 
                }
            }).catch((err)=>{ 
                toast.error(`Error : ${err.message}`)
            })
        }
    }
    const deleteBulkData = async () => {
        let text = "Are you sure to delete this record?";
        if(window.confirm(text) === true) {
            deleteBulkRecord(bulkRecordID).then((response)=>{
                if(response?.data?.status){
                    toast.success(response.data.message)
                    setLoaderVisible(false)
                    setDeleteDisabled(true)
                }else{ 
                    toast.error(response.error.data.message) 
                }
            }).catch((err)=>{ 
                toast.error(`Error : ${err.message}`)
            })
        }
    }
    
    useEffect(()=>{  
        getAllRecord().then((response)=>{ 
            setData(response?.data?.data) 
            setLoaderVisible(false)
        }).catch((err)=>{ 
            toast.error(`Error : ${err.message}`)
        })
    },[getAllValidationRecord])

    const handleChange = ({ selectedRows }) => {
        setDeleteDisabled(true)
        let selected_value = []
        selectedRows.map((data)=>{
            selected_value.push(data._id)
        })
        if(selected_value.length>0){
            setDeleteDisabled(false)
        }
        setBulkRecordID(selected_value) 
    }
     
    const appendEducationDiv = (count) => { 
        inputs.push(count)
        setInputs([...inputs]);
    }
    const handleDeleteInput = (index) => {
        const newArray = [...inputs];
        newArray.splice(index, 1);
        setInputs(newArray);
    };
    const deleteEducationData = (index) => {
        let text = "Are you sure to delete this record?";
        if(window.confirm(text) === true) {
            alert('Comming soon...')
        } 
    };
    
    return ( 
        <>  
            <ToastContainer /> 
            <div className="row p-5">
                <div className="container border">                        
                    <div className="col-md-12 text-end mb-4 mt-5">                        
                        {(!deleteDisabled)?
                            <button className="btn btn-danger btn-sm mr-3" type="button" onClick={()=> { deleteBulkData() 
                            setLoaderVisible(true) } } disabled={deleteDisabled}>
                                <b>{pageName[0].title_2}</b>
                            </button>
                        :''}&nbsp;&nbsp;
                        <button className="btn btn-primary btn-sm ml-4" type="button" data-bs-toggle="modal" data-bs-target=".bd-example-modal-fullscreen" id="open-modal" onClick={()=>reset()}>
                            <b>{pageName[0].title_1}</b>
                        </button> 
                        <span type="button" data-bs-toggle="modal" data-bs-target=".bd-example-modal-fullscreen-education" id="open-education-modal"></span> 
                    </div>
                    <div className="col-md-12"> 
                        <DataTable
                            title="User List"
                            columns={columns}
                            data={data}
                            pagination
                            selectableRows
                            onSelectedRowsChange={handleChange}  
                            persistTableHead 
                        />   
                    </div>             
                </div>             
            </div>   

            <div className="modal fade bd-example-modal-fullscreen" tabindex="-1" role="dialog" aria-labelledby="myFullLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myFullLargeModalLabel">{pageName[0].title_1}</h4>
                        <button className="btn-close py-1" type="button" data-bs-dismiss="modal" aria-label="Close" id="close-modal" onClick={()=>{setDataID(0)}}></button>
                    </div>
                    <div className="modal-body dark-modal"> 
                        <div className="row border-dark">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form method="POST" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                                            <div className="form theme-f">
                                                <div className="row"> 
                                                    <div className="col-md-4 mb-3">
                                                        <label>First Name</label>
                                                        <input className="form-control" type="text" placeholder="First Name" {...register('first_name', { required: 'This field is required.' })}/>
                                                        {errors.first_name && <p className="text-danger error-custom-single">{errors.first_name.message}</p>}
                                                    </div> 
                                                    <div className="col-md-4 mb-3">
                                                        <label>Last Name</label>
                                                        <input className="form-control" type="text" placeholder="Last Name" {...register('last_name', { required: 'This field is required.' })}/>
                                                        {errors.last_name && <p className="text-danger error-custom-single">{errors.last_name.message}</p>}
                                                    </div>  
                                                    <div className="col-md-4 mb-3">
                                                        <label>Email</label>
                                                        <input className="form-control" type="email" placeholder="Email" {...register('email', { required: 'This field is required.' })}/>
                                                        {errors.email && <p className="text-danger error-custom-single">{errors.email.message}</p>}
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label>Phone</label>
                                                        <input className="form-control" type="number" placeholder="Phone" {...register('phone', { required: 'This field is required.' })}/>
                                                        {errors.phone && <p className="text-danger error-custom-single">{errors.phone.message}</p>}
                                                    </div> 
                                                    <div className="col-md-6 mb-3">
                                                        <label>DOB</label>
                                                        <input className="form-control" type="date" {...register('dob', { required: 'This field is required.' })}/>
                                                        {errors.dob && <p className="text-danger error-custom-single">{errors.dob.message}</p>}
                                                    </div> 
                                                    <div className="col-md-12 mb-3">
                                                        <label>Address</label>
                                                        <textarea className="form-control" type="date" placeholder="Address" {...register('address', { required: 'This field is required.' })}/>
                                                        {errors.address && <p className="text-danger error-custom-single">{errors.address.message}</p>}
                                                    </div>  
                                                    <div class="col-md-12">
                                                        <h5>
                                                            <b><i class="fa fa-building-o"></i> Education</b>
                                                        </h5>
                                                        <hr />   
                                                    </div>   
                                                    <div class="col-md-12 text-end" onClick={()=>appendEducationDiv(inputs.length)}>
                                                        <i className="fa-solid fa-plus plus-icon-custom"></i>
                                                    </div> 
                                                    {educationData.map((item, index) => (
                                                    <>
                                                        <div className="col-md-3 mb-3">
                                                            <label>Degree</label>
                                                            <select className="form-control" {...register(`degree[update-${item._id}]`, { required: true })}defaultValue={item.degree}>    
                                                                <option value="">Select</option> 
                                                                { degree?.map((degreeData,key)=>{
                                                                    return(  
                                                                        <option value={degreeData}>
                                                                            {degreeData}
                                                                        </option> 
                                                                    )})
                                                                } 
                                                            </select> 
                                                            {errors.Degree && <p className="text-danger error-custom-single">{errors.Degree.message}</p>}
                                                        </div>  
                                                        <div className="col-md-3 mb-3">
                                                            <label>College</label>
                                                            <input className="form-control" type="text" {...register(`college[update-${item._id}]`, { required: 'This field is required.' })} defaultValue={item.college}/>
                                                            {errors.college && <p className="text-danger error-custom-single">{errors.college.message}</p>}
                                                        </div> 
                                                        <div className="col-md-3 mb-3">
                                                            <label>Start Year</label>
                                                            <input className="form-control" type="date" {...register(`start_year[update-${item._id}]`, { required: 'This field is required.' })} defaultValue={item.start_year.split('T')[0]}/>
                                                            {errors.start_year && <p className="text-danger error-custom-single">{errors.start_year.message}</p>}
                                                        </div> 
                                                        <div className="col-md-3 mb-3">
                                                            <label>End Year</label>
                                                            <input className="form-control" type="date" {...register(`end_year[update-${item._id}]`, { required: 'This field is required.' })} defaultValue={item.end_year.split('T')[0]}/>
                                                            {errors.end_year && <p className="text-danger error-custom-single">{errors.end_year.message}</p>}
                                                          
                                                            <i className="fa-solid fa-minus minus-icon-custom" onClick={() => deleteEducationData(index)}></i> 
                                                            
                                                        </div> 
                                                        
                                                    </>
                                                    ))}
                                                    {inputs.map((item, index) => (
                                                    <>
                                                        <div className="col-md-3 mb-3">
                                                            <label>Degree</label>
                                                            <select className="form-control" {...register(`degree[add-${index}]`, { required: isRequired })}>    
                                                                <option value="">Select</option> 
                                                                { degree?.map((degreeData,key)=>{
                                                                    return(  
                                                                        <option value={degreeData}>
                                                                            {degreeData}
                                                                        </option> 
                                                                    )})
                                                                } 
                                                            </select> 
                                                            {errors.Degree && <p className="text-danger error-custom-single">This field is required.</p>}
                                                        </div>  
                                                        <div className="col-md-3 mb-3">
                                                            <label>College</label>
                                                            <input className="form-control" type="text" {...register(`college[add-${index}]`, { required: isRequired })}/>
                                                            {errors.college && <p className="text-danger error-custom-single">This field is required.</p>}
                                                        </div> 
                                                        <div className="col-md-3 mb-3">
                                                            <label>Start Year</label>
                                                            <input className="form-control" type="date" {...register(`start_year[add-${index}]`, { required: isRequired })}/>
                                                            {errors.start_year && <p className="text-danger error-custom-single">This field is required.</p>}
                                                        </div> 
                                                        <div className="col-md-3 mb-3">
                                                            <label>End Year</label>
                                                            <input className="form-control" type="date" {...register(`end_year[add-${index}]`, { required:isRequired })}/>
                                                            {errors.end_year && <p className="text-danger error-custom-single">This field is required.</p>}
                                                        
                                                            {inputs.length > 1 && (  
                                                                <i className="fa-solid fa-minus minus-icon-custom" onClick={() => handleDeleteInput(index)}></i> 
                                                            )} 
                                                        </div> 
                                                        
                                                    </>
                                                ))}
                                                </div> 
                                                <div className="row mt-4">
                                                    <div className="col">
                                                        <div className="text-end">   
                                                            <button type="submit" className="btn btn-primary border-dark me-3">
                                                                <b>Save</b>
                                                            </button>
                                                            <button type="reset" className="btn btn-danger border-dark">
                                                                <b>Reset</b>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>   

        <div className="modal fade bd-example-modal-fullscreen-education" tabindex="-1" role="dialog" aria-labelledby="myFullLargeModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myFullLargeModalLabel">User Education Data</h4>
                        <button className="btn-close py-1" type="button" data-bs-dismiss="modal" aria-label="Close" id="close-modal" onClick={()=>{setDataID(0)}}></button>
                    </div>
                    <div className="modal-body dark-modal"> 
                        <div className="row border-dark">
                            <div className="col-sm-12">
                                <div className="card">
                                    <div className="card-body"> 
                                        <div className="form theme-f">
                                            <div className="row"> 
                                                <table class="table">
                                                    <thead>
                                                        <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Degree</th>
                                                        <th scope="col">College</th>
                                                        <th scope="col">Start Year</th>
                                                        <th scope="col">End Year</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {educationData.map((item, index) => ( 
                                                        <tr key={index}>
                                                            <th scope="row">{index+1}</th>
                                                            <td>{item.degree}</td>
                                                            <td>{item.college}</td>
                                                            <td>{item.start_year.split('T')[0]}</td>
                                                            <td>{item.end_year.split('T')[0]}</td>
                                                        </tr>
                                                        ))}
                                                    </tbody>
                                                </table> 
                                            </div> 
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}