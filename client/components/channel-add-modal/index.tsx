import React, { useState } from 'react'
import { useSWRConfig } from 'swr'
import { useWindowSize } from '../../hooks/use-window-size'
import styles from './ChannelAddModal.module.css'
import { postRequest } from '../../fetcher'

type ChannelAddParam = {
  name: string
  description: string
}

const ChannelAddModal: React.VFC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const [channelName, setChannelName] = useState('')
  const [description, setDescription] = useState('')
  const { width: windowWidth } = useWindowSize()
  const { mutate } = useSWRConfig()

  return (
    <>
      <div
        style={{
          left: `${windowWidth / 2 - 600 / 2}px`,
        }}
        className={styles.container}
      >
        <h2 className={styles.modalTitle}>NEW CHANNEL</h2>
        <div className={styles.formContainer}>
          <div className={styles.formText}>
            <input
              type="text"
              className={styles.formInputText}
              value={channelName}
              placeholder="Channel Name"
              onChange={(e) => setChannelName(e.currentTarget.value)}
            />
          </div>
          <div className={styles.formTextArea}>
            <textarea
              className={styles.formInputText}
              placeholder="Channel Description"
              rows={8}
              onChange={(e) => setDescription(e.currentTarget.value)}
              value={description}
            ></textarea>
          </div>
        </div>
        <div className={styles.buttonArea}>
          <button
            className={styles.saveButton}
            onClick={async () => {
              try {
                await postRequest<ChannelAddParam, any>('/channels', {
                  name: channelName,
                  description,
                })
                mutate('/channels')
              } catch (err) {
                console.error(err)
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
      <div className={styles.backdrop} onClick={() => closeModal()}></div>
    </>
  )
}

export default ChannelAddModal
