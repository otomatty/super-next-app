'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useFetchAuthFactors } from '@kit/supabase/hooks/use-fetch-mfa-factors';
import { useSignOut } from '@kit/supabase/hooks/use-sign-out';
import { useSupabase } from '@kit/supabase/hooks/use-supabase';
import { Alert, AlertDescription, AlertTitle } from '@kit/ui/alert';
import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@kit/ui/form';
import { If } from '@kit/ui/if';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@kit/ui/input-otp';
import { Spinner } from '@kit/ui/spinner';

export function MultiFactorChallengeContainer({
  paths,
  userId,
}: React.PropsWithChildren<{
  userId: string;
  paths: {
    redirectPath: string;
  };
}>) {
  const verifyMFAChallenge = useVerifyMFAChallenge({
    onSuccess: () => {
      window.location.replace(paths.redirectPath);
    },
  });

  const verificationCodeForm = useForm({
    resolver: zodResolver(
      z.object({
        factorId: z.string().min(1),
        verificationCode: z.string().min(6).max(6),
      })
    ),
    defaultValues: {
      factorId: '',
      verificationCode: '',
    },
  });

  const factorId = useWatch({
    name: 'factorId',
    control: verificationCodeForm.control,
  });

  if (!factorId) {
    return (
      <FactorsListContainer
        userId={userId}
        onSelect={(factorId) => {
          verificationCodeForm.setValue('factorId', factorId);
        }}
      />
    );
  }

  return (
    <Form {...verificationCodeForm}>
      <form
        className={'w-full'}
        onSubmit={verificationCodeForm.handleSubmit(async (data) => {
          await verifyMFAChallenge.mutateAsync({
            factorId,
            verificationCode: data.verificationCode,
          });
        })}
      >
        <div className={'flex flex-col space-y-4'}>
          <span className={'text-muted-foreground text-sm'}>
            認証アプリに表示された6桁のコードを入力してください
          </span>

          <div className={'flex w-full flex-col space-y-2.5'}>
            <div className={'flex flex-col space-y-4'}>
              <If condition={verifyMFAChallenge.error}>
                <Alert variant={'destructive'}>
                  <ExclamationTriangleIcon className={'h-5'} />

                  <AlertTitle>認証コードが無効です</AlertTitle>

                  <AlertDescription>
                    入力されたコードが正しくありません。もう一度お試しください。
                  </AlertDescription>
                </Alert>
              </If>

              <FormField
                name={'verificationCode'}
                render={({ field }) => {
                  return (
                    <FormItem
                      className={
                        'mx-auto flex flex-col items-center justify-center'
                      }
                    >
                      <FormControl>
                        <InputOTP {...field} maxLength={6} minLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>

                      <FormDescription>
                        認証アプリに表示された6桁のコードを入力してください
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <Button
            disabled={
              verifyMFAChallenge.isPending ||
              !verificationCodeForm.formState.isValid
            }
          >
            {verifyMFAChallenge.isPending ? '認証中...' : '認証コードを送信'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function useVerifyMFAChallenge({ onSuccess }: { onSuccess: () => void }) {
  const client = useSupabase();
  const mutationKey = ['mfa-verify-challenge'];

  const mutationFn = async (params: {
    factorId: string;
    verificationCode: string;
  }) => {
    const { factorId, verificationCode: code } = params;

    const response = await client.auth.mfa.challengeAndVerify({
      factorId,
      code,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({ mutationKey, mutationFn, onSuccess });
}

function FactorsListContainer({
  onSelect,
  userId,
}: React.PropsWithChildren<{
  userId: string;
  onSelect: (factor: string) => void;
}>) {
  const signOut = useSignOut();
  const { data: factors, isLoading, error } = useFetchAuthFactors(userId);

  const isSuccess = factors && !isLoading && !error;

  useEffect(() => {
    // If there is an error, sign out
    if (error) {
      void signOut.mutateAsync();
    }
  }, [error, signOut]);

  useEffect(() => {
    // If there is only one factor, select it automatically
    if (isSuccess && factors.totp.length === 1) {
      const factorId = factors.totp[0]?.id;

      if (factorId) {
        onSelect(factorId);
      }
    }
  });

  if (isLoading) {
    return (
      <div className={'flex flex-col items-center space-y-4 py-8'}>
        <Spinner />

        <div>認証方法を読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={'w-full'}>
        <Alert variant={'destructive'}>
          <ExclamationTriangleIcon className={'h-4'} />

          <AlertTitle>二段階認証の設定に失敗しました</AlertTitle>

          <AlertDescription>
            設定の読み込み中にエラーが発生しました。もう一度お試しください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const verifiedFactors = factors?.totp ?? [];

  return (
    <div className={'flex flex-col space-y-4'}>
      <div>
        <span className={'font-medium'}>
          使用する認証方法を選択してください
        </span>
      </div>

      <div className={'flex flex-col space-y-2'}>
        {verifiedFactors.map((factor) => (
          <div key={factor.id}>
            <Button
              variant={'outline'}
              className={'w-full'}
              onClick={() => onSelect(factor.id)}
            >
              {factor.friendly_name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
