import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'

import Issue from './models/issue';

const app = express();
const router = express.Router();

/**
 * Usage of CORS ( Cross Origin Resource Sharing)
 */
app.use(cors());

/**
 * Usage of the body parser
 */
app.use(bodyParser.json());

/**
 * mongoose connection
 */
mongoose.connect('mongodb://localhost/Bug_Tracker');
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('MongoDB connected');
});

/**
 * This is used to GET all the issues
 */
router.route('/issues').get((req,res)=>{
    Issue.find((err, issue)=>{
        if(err)
            console.log(err);
        else
            res.json(issue)
    });
});

/**
 * This is used to GET specific issues
 */
router.route('/issues/:id').get((req, res)=>{
    Issue.findById(req.params.id, (err, issue)=>{
        if(err)
            console.log(err);
        else
            res.json(issue);
    });
});

/**
 * This is used to POST and issues
 */
router.route('/issues/add').post((req,res)=>{
    let issue = new Issue(req.body);
    issue.save()
        .then(issue =>{
            res.status(200).json({
                'issue': 'Added Successfully'
            });
        })
        .catch(err =>{
            res.status(400).send('Failed to create a new record')
        })
})

/**
 * This is used to UPDATE a specific ID
 */
router.route('/issues/update/:id').post((req, res)=>{
    Issue.findById(req.params.id, (err, issue)=>{
        if(!issue){
            return next(new Error('Could not load document'));
        }
        else{
            issue.title = req.body.title;
            issue.responsible = req.body.responsible;
            issue.description = req.body.description;
            issue.severity = req.body.severity;
            issue.status = req.body.status;

            issue.save().then(issue =>{
                res.json('Update Done!');
            }).catch(err => {
                res.status(400).send('Update Failed');
            });
        }
    });
});

/**
 * This is used to DELETE the specific ID
 */
router.route('/issues/delete/:id').get((req, res)=>{
    Issue.findByIdAndRemove({_id: req.params.id}, (err,issue)=>{
        if(err)
            res.json(err);
        else
            res.json('Removed successfully');
    })
})

app.use('/',router);


/**
 * This activates the server
 */
app.listen(4000, () => console.log('Server is Activated'))