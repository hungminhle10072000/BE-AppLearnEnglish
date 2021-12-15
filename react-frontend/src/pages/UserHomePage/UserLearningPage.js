import React, {Component} from 'react'
import UserChapterItem from '../../components/UserComponents/UserChapterItem'
import VideoContainer from '../../components/UserComponents/VideoContainer';
import allActions from '../../actions';
import { connect } from 'react-redux';
import Comments from '../../components/Comment/Comments'
import { Link } from 'react-router-dom'
class UserLearningPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            isChapter:true,
            isComment:false,
            userCurrent: {
                id: -1
            },
            learningLessonId:0,
            comments:[],
            isLogin:true,
            linkVideo:'https://web-english.s3.ap-southeast-1.amazonaws.com/1637087592056-trumua.mp4',
            course:{
                id:this.props.match.params.id,
                name:'Khoa Hoc 1',
                image: 'linkImage',
                introduce: 'introduce',
                chapters: [],
                users:[]
            },
        }
    }
    componentDidUpdate(prevProps) {
        var course = this.props.course;
        if (prevProps.comments.length ===0 && this.props.comments.length !==0) {
            this.props.onGetCommentByLessonId(this.state.learningLessonId)
            this.setState({
                course: course,
                comments: this.props.comments,
                userCurrent: this.props.userCurrent
            })

        }
        if ( prevProps.comments[0] && this.props.comments[0] && prevProps.comments[0].id !== this.props.comments[0].id) {
            this.props.onGetCommentByLessonId(this.state.learningLessonId)
            this.setState({
                course: course,
                comments: this.props.comments,
                userCurrent: this.props.userCurrent
            })

        }
        if (prevProps.comments.length !== this.props.comments.length) {
            this.props.onGetCommentByLessonId(this.state.learningLessonId)
            this.setState({
                course: course,
                comments: this.props.comments,
                userCurrent: this.props.userCurrent
            })

        }
    }
    componentDidMount() {
        this.props.onEditCourse(this.state.course.id);
        this.props.onGetCommentByLessonId(this.state.learningLessonId)
        var course = this.props.course;
        this.setState({
            course: course,
            comments: this.props.comments,
            userCurrent: this.props.userCurrent
        })
    }
    componentWillReceiveProps(nextProps) {
        
        if(nextProps && nextProps.course){
            var {course} = nextProps;
            this.setState({
                course: course,
                comments: this.props.comments,
                userCurrent: nextProps.userCurrent
            })

        }
    }

    changedVideo = (url,lessonId) => {
        this.props.onGetCommentByLessonId(lessonId)
        this.setState({linkVideo:url,
            learningLessonId:lessonId,
            comments: this.props.comments
        })
        
    }
    changedIsChapter =()  => {
        this.setState({isChapter: true,
        isComment: false})
    }
    changedIsComment =()  => {
        this.setState({isChapter: false,
        isComment: true})
    }
    showChapterItem = (isSub) => {
        return this.state.course.chapters.map((chapter)=><UserChapterItem key={chapter.id} chapter={chapter} changedVideo={this.changedVideo} isSub = {isSub}></UserChapterItem>)
    }


    render() {
        var isSub = true;
        if (this.state.course.users != null && this.state.course.users.length > 0) {
            for (let x of this.state.course.users) {
                if (x.id === this.state.userCurrent.id) {
                    isSub=false
                }
            }
        }
        return(
            <div>
               <VideoContainer video={this.state.linkVideo}></VideoContainer>
               <h3>{this.state.course.name}</h3>
               <br/>
               {
                   isSub && (this.state.userCurrent.id === -1)&&(
                    <div>
                        <h2>Miễn phí</h2>
               
                            <button onClick={()=>window.location.pathname = ('/login')}>Đăng ký học</button>
                     
                        <br/>
                        <br/>
                    </div>
                   )
               }
               
               <div className='row'>
                   <div className='col-2'>
                        <button onClick={() => this.changedIsChapter()} >Tổng quan</button>
                        <button onClick={() => this.changedIsComment()}>Bình luận</button>
                   </div>
               </div>
               <br/>
               {this.state.isChapter&&this.showChapterItem(!isSub)}
               {this.state.isComment && (<Comments currentUserId={this.state.userCurrent.id} comments={this.state.comments} learningLessonId={this.state.learningLessonId}/>)} 
                <br/>
                <br/>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        course: state.courseEditReducer,
        comments: state.commentReducer,
        userCurrent: state.itemUserLogin
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onEditCourse: (id) => {
            dispatch(allActions.courseAction.actGetCourseRequest(id))
        },

        onUpdateCourse: (courseDto, file) => {
            dispatch(allActions.courseAction.actUpdateCourseRequest(courseDto, file))
        },
        onGetCommentByLessonId: (lessonId) => {
            dispatch(allActions.commentAction.actGetCommentByLessonIdRequest(lessonId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserLearningPage);