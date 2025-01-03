import { useState } from 'react'
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface QuestionAnswerFeedbackProps {
  question: string
  answer: string
  onFeedback: (feedback: { liked: boolean; comment: string }) => void
}

export function QuestionAnswerFeedback({ question, answer, onFeedback }: QuestionAnswerFeedbackProps) {
  const [liked, setLiked] = useState<boolean | null>(null)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [comment, setComment] = useState('')

  const handleLike = (isLiked: boolean) => {
    setLiked(isLiked)
    if (!showCommentBox) {
      onFeedback({ liked: isLiked, comment: '' })
    }
  }

  const handleSubmitFeedback = () => {
    onFeedback({ liked: liked!, comment })
    setShowCommentBox(false)
    setComment('')
  }

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>Q: {question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A: {answer}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant={liked === true ? "default" : "outline"}
            size="sm"
            onClick={() => handleLike(true)}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Helpful
          </Button>
          <Button
            variant={liked === false ? "default" : "outline"}
            size="sm"
            onClick={() => handleLike(false)}
          >
            <ThumbsDown className="mr-2 h-4 w-4" />
            Not Helpful
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCommentBox(!showCommentBox)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        </div>
        {showCommentBox && (
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Provide feedback on issues with the response, incorrect information, or areas that need to be addressed."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

