import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram.filters import CommandStart
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, \
                          WebAppInfo
from config import BOT_TOKEN


# All handlers should be attached to the Router (or Dispatcher).
dp = Dispatcher()


if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


# Send welcome message and display button that opens mini app.
@dp.message(CommandStart())
async def command_start_handler(message: Message) -> None:
    markup = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="Открыть приложение",
                    web_app=WebAppInfo(url="https://ksaidy.pythonanywhere.com/")
                )
            ]
        ],
        resize_keyboard=True
    )
    await message.answer("CrowdSense - сервис по отслеживанию загруженности "
                         "транспорта.\nДля использования сервиса, нажмите на "
                         "кнопку.", reply_markup=markup)


async def main() -> None:
    # Initialize Bot instance with default bot properties which will be passed
    # to all API calls.
    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(
        parse_mode=ParseMode.HTML))

    # Run events dispatching.
    await dp.start_polling(bot)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, stream=sys.stdout)
    asyncio.run(main())
