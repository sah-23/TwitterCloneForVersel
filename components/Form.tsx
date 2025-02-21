import axios from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import useLoginModal from '@/hooks/useLoginModal';
import useRegisterModal from '@/hooks/useRegisterModal';
import useCurrentUser from '@/hooks/useCurrentUser';
import usePosts from '@/hooks/usePosts';
import usePost from '@/hooks/usePost';

import Avatar from './Avatar';
import Button from './Button';

import { motion } from "framer-motion";

interface FormProps {
  placeholder: string;
  isComment?: boolean;
  postId?: string;
  className? :string;
}

const Form: React.FC<FormProps> = ({ placeholder, isComment, postId }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { data: currentUser } = useCurrentUser();
  const { mutate: mutatePosts } = usePosts();
  const { mutate: mutatePost } = usePost(postId as string);

  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = isComment ? `/api/comments?postId=${postId}` : '/api/posts';

      await axios.post(url, { body });

      toast.success('Tweet created');
      setBody('');
      mutatePosts();
      mutatePost();
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [body, mutatePosts, isComment, postId, mutatePost]);

  return (
    <div className="border-b-[1px] border-neutral-800 px-5 py-2">
      {currentUser ? (
        <div className="flex flex-row gap-4">
          <div>
            <Avatar userId={currentUser?.id} />
          </div>
          <div className="w-full">
            <textarea
              disabled={isLoading}
              onChange={(event) => setBody(event.target.value)}
              value={body}
              className="
                disabled:opacity-80
                peer
                resize-none 
                mt-3 
                w-full 
                bg-customeGreenLighter
                ring-0 
                outline-none 
                text-[20px] 
                placeholder-white
                text-white
                rounded-md /* <-- Add this */
                border border-gray-300 /* <-- Add this for visibility */
              "
              placeholder={placeholder}>
            </textarea>
            <hr 
              className="
                opacity-0 
                peer-focus:opacity-100 
                h-[1px] 
                w-full 
                border-neutral-800 
                transition"
            />
            <div className="mt-4 flex flex-row justify-end">
              <Button disabled={isLoading || !body} onClick={onSubmit} label="Tweet" />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 flex justify-center">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-lg shadow-lg max-w-md w-full min-h-[150px]">

            <h1 className="text-white text-2xl text-center mb-4 font-bold">Hey</h1>
            <div className="flex flex-row items-center justify-center gap-4">
              
              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button label="Login" onClick={loginModal.onOpen} />
              </motion.div>

              {/* Register Button */}
              <div className="border-0 focus:ring-0 focus:outline-none shadow-non">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    label="Register" 
                    onClick={registerModal.onOpen} 
                    secondary
                  />
                </motion.div>
              </div>


            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
