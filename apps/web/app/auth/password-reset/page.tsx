import Link from 'next/link';

import { PasswordResetRequestContainer } from '@kit/auth/password-reset';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';

import pathsConfig from '~/config/paths.config';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export const generateMetadata = async () => {
  const { t } = await createI18nServerInstance();

  return {
    title: t('auth:passwordResetLabel'),
  };
};

const { callback, passwordUpdate, signIn } = pathsConfig.auth;
const redirectPath = `${callback}?next=${passwordUpdate}`;

function PasswordResetPage() {
  return (
    <>
      <Heading level={5} className={'tracking-tight'}>
        パスワードをリセット
      </Heading>

      <div className={'flex flex-col space-y-4'}>
        <PasswordResetRequestContainer redirectPath={redirectPath} />

        <div className={'flex justify-center text-xs'}>
          <Button asChild variant={'link'} size={'sm'}>
            <Link href={signIn}>パスワードを思い出した方はこちら</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default withI18n(PasswordResetPage);
