"use client";

import axios from "axios";
import * as z from "zod";

import {CONVERSATION} from "@/constants";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useState} from "react";

import Heading from "@/components/heading";
import {Form, FormControl, FormField, FormItem} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {formSchema} from "./constants";
import {Button} from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";

import OpenAI from "openai";
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;
import {cn} from "@/lib/utils";
import {BotAvatar, UserAvatar} from "@/components/avatar";
import {useProModal} from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const ConversationPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionMessage[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessage = {
        role: "user",
        content: values.prompt
      }

      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/conversation", {
        messages: newMessages
      });

      setMessages((current) => [...current, userMessage, response.data]);

      form.reset();

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      router.refresh();
    }
  }

  return (
    <>
      <Heading
        title={CONVERSATION.label}
        description={CONVERSATION.desc}
        icon={CONVERSATION.icon}
        iconColor={CONVERSATION.color}
        bgColor={CONVERSATION.bgColor}
      />
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField name="prompt" render={({field}) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none px-4 bg-[#e8f0fe] focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading}
                    placeholder="How do I calculate the radius of a circle?"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )} />
            <Button className="col-span-12 lg:col-span-2" disabled={isLoading}>Generate</Button>
          </form>
        </Form>
      </div>
      <div className="space-y-4 mt-4 px-4">
        {
          isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )
        }
        {
          messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )
        }
        <div className="flex flex-col-reverse gap-y-4">
          {
            messages.map((message) => (
              <div
                key={message.content}
                className={cn("p-8 w-full flex items-center gap-x-8 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">
                  {message.content}
                </p>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default ConversationPage;
