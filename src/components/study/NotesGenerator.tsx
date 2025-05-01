
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";

interface NotesGeneratorProps {
  onSendMessage: (message: string) => void;
}

const NotesGenerator: React.FC<NotesGeneratorProps> = ({ onSendMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t, language } = useLanguage();

  // Define the validation schema for the form
  const formSchema = z.object({
    topic: z.string().min(1, {
      message: language === 'en' ? "Topic is required" : "विषय आवश्यक है",
    }),
    subject: z.string().optional(),
    className: z.string().optional(),
    chapter: z.string().optional(),
    contentLanguage: z.string().default("same"),
    additionalInfo: z.string().optional(),
    format: z.string().default("comprehensive"),
  });

  // Define form with React Hook Form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      subject: "",
      className: "",
      chapter: "",
      contentLanguage: "same",
      additionalInfo: "",
      format: "comprehensive",
    },
  });

  const handleGenerateNotes = (values: z.infer<typeof formSchema>) => {
    const { topic, subject, className, chapter, contentLanguage, additionalInfo, format } = values;
    
    if (!topic.trim()) {
      toast.error(language === 'en' ? 'Please enter a topic for the notes' : 'कृपया नोट्स के लिए एक विषय दर्ज करें');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    // Build a comprehensive prompt based on all input fields
    if (language === 'en') {
      // English prompt construction
      let notesLanguage = contentLanguage === "same" ? "English" : 
                         contentLanguage === "hi" ? "Hindi" : 
                         contentLanguage === "mix" ? "Hindi and English mixed" : "English";
      
      prompt = `Generate ${format} study notes on the topic "${topic}"`;
      
      if (subject) prompt += ` for subject ${subject}`;
      if (className) prompt += ` for class/grade ${className}`;
      if (chapter) prompt += ` covering chapter "${chapter}"`;
      
      prompt += `. Create the notes in ${notesLanguage}.`;
      
      if (format === "concise") {
        prompt += " Include only the key points, important definitions, and core concepts. Format with bullet points for easy quick review.";
      } else if (format === "comprehensive") {
        prompt += " Include detailed explanations, examples, diagrams descriptions, and connections to related concepts. Format with clear headings and subheadings.";
      } else if (format === "exam") {
        prompt += " Highlight commonly tested concepts, include practice problems with solutions, and provide memory aids. Format with clear sections for different question types likely to appear.";
      }
      
      if (additionalInfo) prompt += ` Additional requirements: ${additionalInfo}`;
    } else {
      // Hindi prompt construction
      let notesLanguage = contentLanguage === "same" ? "हिंदी" : 
                         contentLanguage === "en" ? "अंग्रेज़ी" : 
                         contentLanguage === "mix" ? "हिंदी और अंग्रेज़ी मिक्स्ड" : "हिंदी";
      
      prompt = `"${topic}" विषय पर ${format === "concise" ? "संक्षिप्त" : format === "comprehensive" ? "विस्तृत" : "परीक्षा-केंद्रित"} अध्ययन नोट्स तैयार करें`;
      
      if (subject) prompt += ` ${subject} विषय के लिए`;
      if (className) prompt += ` कक्षा ${className} के लिए`;
      if (chapter) prompt += ` "${chapter}" अध्याय को कवर करते हुए`;
      
      prompt += `. नोट्स ${notesLanguage} में बनाएं।`;
      
      if (format === "concise") {
        prompt += " केवल मुख्य बिंदु, महत्वपूर्ण परिभाषाएँ और प्रमुख अवधारणाएँ शामिल करें। आसान त्वरित समीक्षा के लिए बुलेट पॉइंट्स के साथ प्रारूप करें।";
      } else if (format === "comprehensive") {
        prompt += " विस्तृत व्याख्या, उदाहरण, आरेख विवरण और संबंधित अवधारणाओं के साथ कनेक्शन शामिल करें। स्पष्ट हेडिंग और सबहेडिंग के साथ प्रारूप करें।";
      } else if (format === "exam") {
        prompt += " आमतौर पर परीक्षा में पूछे जाने वाले अवधारणाओं को हाइलाइट करें, समाधान के साथ अभ्यास समस्याएं शामिल करें, और याददाश्त सहायता प्रदान करें। विभिन्न प्रकार के संभावित परीक्षा प्रश्नों के लिए स्पष्ट वर्गीकरण के साथ प्रारूप करें।";
      }
      
      if (additionalInfo) prompt += ` अतिरिक्त आवश्यकताएँ: ${additionalInfo}`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success(language === 'en' ? 'Generating notes...' : 'नोट्स जनरेट हो रहे हैं...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          {t('notesGenerator')}
        </CardTitle>
        <CardDescription>
          {t('notesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGenerateNotes)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Topic' : 'विषय'} *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? "Enter topic for notes" : "नोट्स के लिए विषय दर्ज करें"} 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Subject' : 'पाठ्य विषय'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? "E.g. Mathematics" : "जैसे: गणित"} 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'en' ? 'Class/Grade' : 'कक्षा'}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={language === 'en' ? "E.g. 10th" : "जैसे: 10वीं"} 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="chapter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Chapter Name' : 'अध्याय का नाम'}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={language === 'en' ? "E.g. Trigonometry" : "जैसे: त्रिकोणमिति"} 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contentLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Content Language' : 'सामग्री भाषा'}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'en' ? "Select language" : "भाषा चुनें"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="same">{language === 'en' ? "Same as interface" : "इंटरफ़ेस के समान"}</SelectItem>
                      <SelectItem value="en">{language === 'en' ? "English" : "अंग्रेज़ी"}</SelectItem>
                      <SelectItem value="hi">{language === 'en' ? "Hindi" : "हिंदी"}</SelectItem>
                      <SelectItem value="mix">{language === 'en' ? "Mixed (Hindi + English)" : "मिश्रित (हिंदी + अंग्रेज़ी)"}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Note Format' : 'नोट प्रारूप'}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="concise">{language === 'en' ? "Concise" : "संक्षिप्त"}</SelectItem>
                      <SelectItem value="comprehensive">{language === 'en' ? "Comprehensive" : "विस्तृत"}</SelectItem>
                      <SelectItem value="exam">{language === 'en' ? "Exam-Focused" : "परीक्षा-केंद्रित"}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'en' ? 'Additional Requirements' : 'अतिरिक्त आवश्यकताएँ'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={language === 'en' ? "Any specific requirements or focus areas" : "कोई विशिष्ट आवश्यकताएँ या फोकस क्षेत्र"} 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {language === 'en' 
                      ? "Specify any particular focus, examples needed, etc." 
                      : "कोई विशेष फोकस, आवश्यक उदाहरण, आदि निर्दिष्ट करें।"}
                  </FormDescription>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isLoading || !form.getValues().topic.trim()} 
              className="w-full mt-6"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {language === 'en' ? 'Processing...' : 'प्रोसेसिंग...'}
                </>
              ) : (
                language === 'en' ? 'Generate Notes' : 'नोट्स जनरेट करें'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NotesGenerator;
