
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Send, ThumbsUp, ThumbsDown, Star, MessageSquare
} from 'lucide-react';
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import emailjs from 'emailjs-com';

const Feedback = () => {
  const { currentUser, isLoading } = useAuth();
  const [rating, setRating] = useState<string>('positive');
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // EmailJS configuration
  const SERVICE_ID = 'default_service'; // Your EmailJS service ID
  const TEMPLATE_ID = 'template_feedback'; // Template ID you created in EmailJS
  const USER_ID = 'rOb0aFIHqSNRXhqDz'; // Your EmailJS public key

  // Send feedback using EmailJS
  const sendFeedback = async () => {
    if (!feedback.trim()) {
      toast.error('कृपया अपनी प्रतिक्रिया दर्ज करें / Please enter your feedback');
      return;
    }

    try {
      setIsSending(true);
      
      const templateParams = {
        user_email: currentUser?.email || 'Anonymous',
        rating: rating,
        message: feedback,
        to_email: 'ajit91884270@gmail.com',
      };
      
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
      
      // Success message
      toast.success('आपकी प्रतिक्रिया भेज दी गई है / Your feedback has been sent');
      setFeedback('');
      setRating('positive');
      
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast.error('प्रतिक्रिया भेजने में विफल / Failed to send feedback');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Share Your Feedback</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How is your experience with Study AI?</CardTitle>
            <CardDescription>
              Your feedback helps us improve our service for all students.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Your overall experience</Label>
              <RadioGroup
                id="rating"
                value={rating}
                onValueChange={setRating}
                className="flex space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="positive" id="positive" />
                  <Label htmlFor="positive" className="flex items-center space-x-1 cursor-pointer">
                    <ThumbsUp className="h-4 w-4 text-green-500" />
                    <span>Positive</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neutral" id="neutral" />
                  <Label htmlFor="neutral" className="flex items-center space-x-1 cursor-pointer">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Neutral</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="negative" id="negative" />
                  <Label htmlFor="negative" className="flex items-center space-x-1 cursor-pointer">
                    <ThumbsDown className="h-4 w-4 text-red-500" />
                    <span>Negative</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Tell us more about your experience</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, ideas, or concerns..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Your feedback will be sent to our team
            </p>
            <Button 
              onClick={sendFeedback} 
              disabled={isSending || !feedback.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isSending ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
          <MessageSquare className="h-10 w-10 mx-auto text-orange-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">We Value Your Input</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your feedback helps us create a better learning experience for all students.
            Thank you for taking the time to share your thoughts with us!
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All submissions are reviewed by our team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
