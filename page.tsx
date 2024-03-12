'use client';

import React, { useEffect, useRef, useState } from 'react';

import Button from '@components/v1/platform/atoms/Button';
import Input from '@components/v1/platform/atoms/Input';
import HeaderSettingContent from '@components/v1/platform/organism/AppSetting/HeaderSettingContent';
import SettingContent from '@components/v1/platform/organism/AppSetting/SettingContent';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import ImageInput from '@components/v1/platform/organism/AppSetting/AppInfo/ImageInput';
import useUserDetails from '@stores/platform/useUserDetails';
import ProfileValidationSchema from '@constants/schema/validation/profile';
import ChangeEmailModal from '@components/v1/platform/organism/UserSetting/Account/ChangeEmailModal';
import ChangePasswordModal from '@components/v1/platform/organism/UserSetting/Account/ChangePasswordModal';
import ForgotPasswordModal from '@components/v1/platform/organism/UserSetting/Account/ForgotPasswordModal';
import LoadingAnimation from '@components/v1/platform/atoms/LoadingAnimation';
import useLinkStore from '@stores/editor/navigation/useLinkStore';
import useLeavePageConfirmation from '@hooks/useLeavePageConfirmation';
import useOrganizationSetting from '@stores/userSetting/useOrganizationSetting';
import bindCurrentValueAndChangeValue from '@hooks/useBindCurrentValAndChangeVal';

interface UpdateUserForm {
  fullName: string;
  username: string;
  phoneNumber?: string;
  profilePicture?: File[];
}

const AccountPage = () => {
  const {
    data,
    // error: userDetailsError,
    isLoading,
    updateUserToApi,
  } = useUserDetails();

  const [editState, setEditState] = useState(false);
  const [isLoadingSubmit, setisLoadingSubmit] = useState(false);
  const [modalChangeEmail, setModalChangeEmail] = useState(false);
  const [modalChangePassword, setModalChangePassword] = useState(false);
  const [modalForgotPassword, setModalForgotPassword] = useState(false);
  const { changeStatus, setChangeStatus } = useOrganizationSetting();
  const formRef = useRef<HTMLFormElement>(null);
  const { setLinkState } = useLinkStore();
  useLeavePageConfirmation();

  const {
    watch,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    mode: 'onBlur',
    resolver: yupResolver(ProfileValidationSchema as any),
  });

  const watchProfilePicture = watch('profilePicture');
  const watchFullName = watch('fullName');
  const watchUsername = watch('username');
  const watchPhoneNumber = watch('phoneNumber');

  useEffect(() => {
    const currentValue = {
      profilePicture: data?.imageUrl,
      fullName: data?.fullName,
      username: data?.username,
      phoneNumber: data?.phone,
    };
    const changeValue = {
      profilePicture: watchProfilePicture?.[0]?.name || data?.imageUrl,
      fullName: watchFullName || data?.fullName,
      username: watchUsername || data?.username,
      phoneNumber: watchPhoneNumber || data?.phone,
    };
    setChangeStatus(bindCurrentValueAndChangeValue(currentValue, changeValue));
  }, [
    data,
    setChangeStatus,
    watchProfilePicture,
    watchFullName,
    watchUsername,
    watchPhoneNumber,
  ]);

  const onFailedCallback = (error: string) => {
    setisLoadingSubmit(false);
    if (error.includes('username')) {
      setError('username', {
        type: 'custom',
        message: 'user name already exist',
      });
    }
  };

  const onSubmit: SubmitHandler<UpdateUserForm> = (formData) => {
    const reqBody = new FormData();
    reqBody.append('username', formData.username);
    reqBody.append('full_name', formData.fullName);
    if (formData.phoneNumber) reqBody.append('phone', formData.phoneNumber);
    if (formData.profilePicture && formData.profilePicture.length) {
      reqBody.append('image', formData.profilePicture[0]);
    }

    setisLoadingSubmit(true);
    if (data) {
      updateUserToApi(
        reqBody,
        () => {
          setisLoadingSubmit(false);
          setEditState(false);
          toast.success(`Account updated`);
        },
        onFailedCallback
      );
    }
  };

  useEffect(() => {
    reset();
  }, [data]);

  useEffect(() => {
    if (!editState) {
      reset();
    }
  }, [editState]);

  useEffect(() => {
    setLinkState({
      isNeedConfirm: changeStatus,
      okHandler: handleSubmit(onSubmit),
    });
  }, [setLinkState, changeStatus]);

  if (isLoading || typeof data === 'undefined') {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  console.log(data);

  return (
    <>
      <HeaderSettingContent title="Account">
        <div className="ml-auto flex items-center gap-2">
          {!editState && (
            <Button
              icon="TbEdit"
              label="Edit"
              variant="ghost"
              color="neutral"
              onClick={() => setEditState(true)}
            />
          )}
          {editState && (
            <>
              <Button
                onClick={() => setEditState(false)}
                label="Cancel"
                color="neutral"
                variant="ghost"
              />
              <Button
                onClick={() => {
                  console.log('Button cliccckk');
                  if (formRef.current) {
                    console.log('Requesttt submit');
                    formRef.current.requestSubmit();
                  }
                }}
                label="Save"
                color="secondary"
                disabled={isLoadingSubmit}
              />
            </>
          )}
        </div>
      </HeaderSettingContent>
      <SettingContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
          ref={formRef}
        >
          <ImageInput
            {...register('profilePicture')}
            type="file"
            accept="image/*"
            className="hidden"
            id="profilePicture"
            editState={editState}
            isLoading={isLoading || isLoadingSubmit}
            imageWidth={50}
            imageHeight={50}
            recommendedAspect="1:1"
            label="Profile Picture"
            buttonLabel="Upload Photo"
            imageUrl={data.imageUrl}
          />
          <Input
            {...register('fullName', {
              value: data.fullName,
            })}
            label="Full Name"
            fullWidth
            disabled={!editState}
            errorMessage={errors.fullName?.message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
          <Input
            {...register('username', {
              value: data.username,
            })}
            label="Username"
            fullWidth
            disabled={!editState}
            errorMessage={errors.username?.message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
          <Input
            {...register('phoneNumber', {
              value: data.phone,
            })}
            label="Phone Number"
            fullWidth
            disabled={!editState}
            errorMessage={errors.phoneNumber?.message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </form>
        <div className="flex flex-col mt-4 w-full gap-2">
          <div className="flex w-full gap-2">
            <Input
              value={data.email}
              label="Email"
              fullWidth
              className="flex-1"
              disabled
            />
            <Button
              variant="ghost"
              color="neutral"
              label="Change"
              className="self-end !m-0"
              onClick={() => setModalChangeEmail(true)}
            />
          </div>
          <div className="flex w-full gap-2">
            <Input
              value=""
              type="password"
              label="Password"
              fullWidth
              className="flex-1"
              disabled
            />
            <Button
              onClick={() => setModalChangePassword(true)}
              variant="ghost"
              color="neutral"
              label="Change"
              className="self-end !m-0"
            />
          </div>
        </div>
        <ChangeEmailModal
          isOpen={modalChangeEmail}
          onClose={() => setModalChangeEmail(false)}
          currentEmail={data.email}
        />
        <ChangePasswordModal
          isOpen={modalChangePassword}
          onClose={() => setModalChangePassword(false)}
          onClickForgotPassword={() => {
            setModalForgotPassword(true);
          }}
        />
        <ForgotPasswordModal
          isOpen={modalForgotPassword}
          onClose={() => setModalForgotPassword(false)}
        />
      </SettingContent>
    </>
  );
};

export default AccountPage;
