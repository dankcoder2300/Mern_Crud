import User from "../model/userModel.js";
import nodeMailer from "nodemailer"

export const create = async(req, res)=>{
    try {

        const userData = new User(req.body);

        if(!userData){
            return res.status(404).json({msg: "User data not found"});
        }

        await userData.save();
        res.status(200).json({msg: "User created successfully"});

    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const getAll = async(req, res) =>{
    try {

        const userData = await User.find();
        if(!userData){
            return res.status(404).json({msg:"User data not found"});
        }
        res.status(200).json(userData);
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const getOne = async(req, res) =>{
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg: "User not found"});
        }
        res.status(200).json(userExist);
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const update = async(req, res) =>{
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(401).json({msg:"User not found"});
        }

        const updatedData = await User.findByIdAndUpdate(id, req.body, {new:true});
        res.status(200).json({msg: "User updated successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const deleteUser = async(req, res) =>{
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if(!userExist){
            return res.status(404).json({msg: "User not exist"});
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({msg: "User deleted successfully"});
        
    } catch (error) {
        res.status(500).json({error: error});
    }
}


export const sendEmail= async (req, res) => {
    const selectedRows = req.body.selectedRows;
    
    try {
        await User.create(selectedRows);

        const transporter= nodeMailer.createTransport({
            service:process.env.SMPT_SERVICE,
            host:process.env.SMPT_HOST,
            port:process.env.SMPT_PORT,
            auth:{
                user:process.env.SMPT_MAIL,
                pass:process.env.SMPT_PASSWORD
            }
        }
        );
  
      const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: 'info@redpositive.in',
        subject: 'SelectedData',
        text: JSON.stringify(selectedRows),
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ 
        message: 'Data saved and email sent successfully.' 
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };